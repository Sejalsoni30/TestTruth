import fs from 'fs/promises';
import path from 'path';
import { Project } from '../models/Project.js';
import { SourceFile } from '../models/SourceFile.js';
import { AnalysisRun } from '../models/AnalysisRun.js';
import { Finding } from '../models/Finding.js';
import { MutationResult } from '../models/MutationResult.js';
import { ExecutionResult } from '../models/ExecutionResult.js';
import { compareFileHashes, computeContentHash } from './fileHashService.js';
import { checkDockerAvailability, runInSandbox } from './sandboxRunner.js';
import { findMutantsInFile, executeMutantsOnProject, GeneratedMutant } from './mutationEngine.js';
import { analyzeTestFile } from './weakAssertionAnalyzer.js';

export async function executeProjectAnalysis(
  runId: string,
  forceFullRun: boolean = false
): Promise<void> {
  const run = await AnalysisRun.findById(runId);
  if (!run) throw new Error('Analysis run not found');

  const projectId = run.projectId;
  const project = await Project.findById(projectId);
  if (!project) throw new Error('Project not found');

  const startTime = Date.now();
  const workDir = path.join(process.cwd(), 'temp', `sandbox_${run._id}_${Date.now()}`);
  await fs.mkdir(workDir, { recursive: true });

  try {
    // 1. Fetch project files and write to sandbox
    const files = await SourceFile.find({ projectId });
    if (files.length === 0) {
      throw new Error('Project has no files uploaded. Please upload a ZIP or source files first.');
    }

    const sourceFiles: Array<{ relativePath: string; content: string }> = [];
    const testFiles: Array<{ relativePath: string; content: string }> = [];

    for (const f of files) {
      const fullPath = path.join(workDir, f.relativePath);
      await fs.mkdir(path.dirname(fullPath), { recursive: true });
      await fs.writeFile(fullPath, f.content, 'utf8');

      // Update file contentHash in DB if not set
      if (!f.contentHash) {
        f.contentHash = computeContentHash(f.content);
        await f.save();
      }

      if (f.fileType === 'source') {
        sourceFiles.push({ relativePath: f.relativePath, content: f.content });
      } else if (f.fileType === 'test') {
        testFiles.push({ relativePath: f.relativePath, content: f.content });
      }
    }

    // 2. Incremental Run vs Full Run Hash Comparison
    const previousRun = await AnalysisRun.findOne({
      projectId,
      status: 'completed',
      _id: { $ne: run._id },
    }).sort({ createdAt: -1 });

    const hashComparison = compareFileHashes(
      files.map((f) => ({ relativePath: f.relativePath, content: f.content })),
      previousRun?.fileHashes
    );

    const isIncremental = !forceFullRun && hashComparison.isIncremental && previousRun !== null;
    const changedFilePaths = new Set(
      isIncremental ? [...hashComparison.changed, ...hashComparison.added] : files.map((f) => f.relativePath)
    );

    run.isIncremental = isIncremental;
    run.changedFilesCount = isIncremental ? changedFilePaths.size : files.length;
    run.fileHashes = hashComparison.currentHashes;
    run.runModeLabel = isIncremental
      ? `Incremental run (${changedFilePaths.size} file${changedFilePaths.size === 1 ? '' : 's'} changed)`
      : 'Full run';
    run.dockerAvailable = await checkDockerAvailability();
    await run.save();

    // 3. Stage 1: Running Tests in Sandbox
    run.progressStage = 'running tests';
    run.progressMessage = run.dockerAvailable
      ? 'Executing test suite in isolated Docker container...'
      : 'Executing test suite in isolated process sandbox (timeout watchdog active)...';
    await run.save();

    // Determine test command based on package.json scripts or framework
    let testCommand = 'node --test';
    try {
      const pkgPath = path.join(workDir, 'package.json');
      const pkgContent = await fs.readFile(pkgPath, 'utf8');
      const pkg = JSON.parse(pkgContent);
      if (pkg.scripts?.test && !pkg.scripts.test.includes('no test specified')) {
        testCommand = pkg.scripts.test;
      } else if (project.framework === 'jest') {
        testCommand = 'npx --no-install jest || node --test';
      } else if (project.framework === 'vitest') {
        testCommand = 'npx --no-install vitest run || node --test';
      }
    } catch {
      testCommand = 'node --test';
    }

    const baselineExecution = await runInSandbox(workDir, testCommand, 10000);

    // Save Execution Result
    await ExecutionResult.create({
      runId: run._id,
      projectId: project._id,
      sandboxType: run.dockerAvailable ? 'docker' : 'process_isolated',
      command: baselineExecution.command,
      exitCode: baselineExecution.exitCode,
      durationMs: baselineExecution.durationMs,
      stdout: baselineExecution.stdout,
      stderr: baselineExecution.stderr,
      totalTests: baselineExecution.totalTests,
      passedTests: baselineExecution.passedTests,
      failedTests: baselineExecution.failedTests,
      timedOut: baselineExecution.timedOut,
      isolationMetadata: {
        memoryLimitMb: 512,
        timeoutLimitMs: 10000,
        networkIsolated: true,
        environmentSanitized: true,
      },
    });

    // 4. Stage 2: Mutating
    run.progressStage = 'mutating';
    run.progressMessage = isIncremental
      ? `Incremental Mutation: Reusing cached results for ${hashComparison.unchanged.length} unchanged files, mutating ${changedFilePaths.size} changed files...`
      : `Full Mutation: Injecting synthetic mutations across ${sourceFiles.length} source files...`;
    await run.save();

    const mutantsToExecute: GeneratedMutant[] = [];

    // Only generate mutants on files that actually changed
    for (const src of sourceFiles) {
      if (!isIncremental || changedFilePaths.has(src.relativePath)) {
        const fileMutants = findMutantsInFile(src.relativePath, src.content);
        mutantsToExecute.push(...fileMutants);
      }
    }

    // Execute generated mutants in sandbox
    const executedMutantResults = await executeMutantsOnProject(
      workDir,
      mutantsToExecute,
      testCommand,
      5000
    );

    // Save new mutation results
    for (const m of executedMutantResults) {
      await MutationResult.create({
        runId: run._id,
        projectId: project._id,
        filePath: m.filePath,
        line: m.line,
        category: m.category,
        description: m.description,
        originalCodeSnippet: m.originalCodeSnippet,
        mutatedCodeSnippet: m.mutatedCodeSnippet,
        diff: m.diff,
        status: m.status,
        killingTestName: m.killingTestName,
        testOutput: m.testOutput,
        executionDurationMs: m.executionDurationMs,
      });
    }

    // Reuse mutation results for unchanged files in incremental runs
    let reusedCount = 0;
    if (isIncremental && previousRun) {
      const unchangedMutants = await MutationResult.find({
        runId: previousRun._id,
        filePath: { $in: hashComparison.unchanged },
      });

      for (const oldM of unchangedMutants) {
        await MutationResult.create({
          runId: run._id,
          projectId: project._id,
          filePath: oldM.filePath,
          line: oldM.line,
          category: oldM.category,
          description: oldM.description,
          originalCodeSnippet: oldM.originalCodeSnippet,
          mutatedCodeSnippet: oldM.mutatedCodeSnippet,
          diff: oldM.diff,
          status: oldM.status,
          killingTestName: oldM.killingTestName,
          testOutput: oldM.testOutput,
          executionDurationMs: oldM.executionDurationMs,
        });
        reusedCount++;
      }
    }

    run.reusedMutantsCount = reusedCount;

    // 5. Stage 3: Analysing AST for Weak Assertions
    run.progressStage = 'analysing';
    run.progressMessage = 'Auditing test files for weak assertions, run-only tests, and unverified exception paths...';
    await run.save();

    let weakAssertionsCount = 0;
    let runOnlyTestsCount = 0;
    let missingScenariosCount = 0;

    for (const tf of testFiles) {
      const fileFindings = analyzeTestFile(tf.relativePath, tf.content, sourceFiles);

      for (const f of fileFindings) {
        if (f.ruleId === 'TEST-NO-ASSERTION') {
          runOnlyTestsCount++;
        } else if (f.ruleId === 'TEST-SHALLOW-TRUTHINESS' || f.ruleId === 'TEST-TAUTOLOGY') {
          weakAssertionsCount++;
        } else if (f.ruleId === 'TEST-MISSING-EXCEPTION') {
          missingScenariosCount++;
        }

        await Finding.create({
          runId: run._id,
          projectId: project._id,
          classification: f.classification,
          severity: f.severity,
          title: f.title,
          filePath: f.filePath,
          line: f.line,
          column: f.column || 1,
          whyUnreliable: f.whyUnreliable,
          suggestedFix: f.suggestedFix,
          confidence: f.confidence,
          confidenceScore: f.confidenceScore,
          evidence: f.evidence,
          ruleId: f.ruleId,
          status: 'active',
        });
      }
    }

    // 6. Aggregate Metrics & Save
    const allMutations = await MutationResult.find({ runId: run._id });
    const killedMutants = allMutations.filter((m) => m.status === 'killed').length;
    const survivedMutants = allMutations.filter((m) => m.status === 'survived').length;
    const totalMutants = allMutations.length;
    const mutationKillRate = totalMutants > 0 ? Number(((killedMutants / totalMutants) * 100).toFixed(1)) : 0;
    const totalFindings = await Finding.countDocuments({ runId: run._id });

    const totalDuration = Date.now() - startTime;

    run.status = 'completed';
    run.progressStage = 'done';
    run.progressMessage = `Analysis completed in ${(totalDuration / 1000).toFixed(1)}s (${run.runModeLabel}).`;
    run.completedAt = new Date();
    run.summaryMetrics = {
      totalTests: baselineExecution.totalTests,
      passedExecution: baselineExecution.passedTests,
      failedExecution: baselineExecution.failedTests,
      totalMutants,
      killedMutants,
      survivedMutants,
      mutationKillRate,
      weakAssertionsCount,
      runOnlyTestsCount,
      missingScenariosCount,
      totalFindings,
    };
    run.executionSandbox = {
      type: run.dockerAvailable ? 'docker' : 'process_isolated',
      durationMs: totalDuration,
      exitCode: baselineExecution.exitCode,
      timedOut: baselineExecution.timedOut,
    };

    await run.save();

    // Update project stats
    project.stats.lastRunAt = new Date();
    project.stats.lastFindingsCount = totalFindings;
    project.stats.lastMutationKillRate = mutationKillRate;
    await project.save();
  } catch (err: any) {
    console.error('[AnalysisPipeline] Execution failed:', err);
    run.status = 'failed';
    run.progressStage = 'failed';
    run.progressMessage = `Run failed: ${err.message}`;
    run.errorMessage = err.message;
    await run.save();
  } finally {
    // Clean up temporary workspace directory
    try {
      await fs.rm(workDir, { recursive: true, force: true });
    } catch {
      // ignore directory cleanup error
    }
  }
}
