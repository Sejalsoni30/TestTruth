import { Response } from 'express';
import mongoose from 'mongoose';
import { Project } from '../models/Project.js';
import { AnalysisRun } from '../models/AnalysisRun.js';
import { Finding } from '../models/Finding.js';
import { executeProjectAnalysis } from '../services/analysisPipelineService.js';
import { MutationResult } from '../models/MutationResult.js';
import { ExecutionResult } from '../models/ExecutionResult.js';

export async function startAnalysisRun(req: AuthRequest, res: Response): Promise<void> {
  const { projectId, forceFullRun } = req.body;
  const userId = req.user!.userId;

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    res.status(400).json({ error: 'Invalid project ID' });
    return;
  }

  const project = await Project.findOne({ _id: projectId, userId });
  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }

  // Create queued run record
  const run = await AnalysisRun.create({
    projectId: project._id,
    userId,
    status: 'running',
    progressStage: 'queued',
    progressMessage: 'Initializing sandbox environment...',
    triggerType: 'manual',
    isIncremental: false,
    changedFilesCount: 0,
    reusedMutantsCount: 0,
    runModeLabel: forceFullRun ? 'Force full run' : 'Analyzing changes...',
  });

  // Execute pipeline in background
  executeProjectAnalysis(run._id.toString(), !!forceFullRun).catch((err) => {
    console.error(`[AnalysisRun] Error in run ${run._id}:`, err);
  });

  res.status(202).json({
    message: 'Analysis run initiated',
    runId: run._id,
    status: run.status,
  });
}

export async function getRunStatus(req: AuthRequest, res: Response): Promise<void> {
  const { runId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(runId)) {
    res.status(400).json({ error: 'Invalid run ID' });
    return;
  }

  const run = await AnalysisRun.findById(runId);
  if (!run) {
    res.status(404).json({ error: 'Analysis run not found' });
    return;
  }

  res.status(200).json({
    runId: run._id,
    status: run.status,
    progressStage: run.progressStage,
    progressMessage: run.progressMessage,
    isIncremental: run.isIncremental,
    changedFilesCount: run.changedFilesCount,
    reusedMutantsCount: run.reusedMutantsCount,
    runModeLabel: run.runModeLabel,
    durationMs: run.executionSandbox?.durationMs || 0,
    dockerAvailable: run.dockerAvailable,
    summaryMetrics: run.summaryMetrics,
    errorMessage: run.errorMessage,
  });
}
import { AuthRequest } from '../middleware/auth.js';

export async function getDashboardMetrics(req: AuthRequest, res: Response): Promise<void> {
  const userId = new mongoose.Types.ObjectId(req.user!.userId);

  const totalProjects = await Project.countDocuments({ userId });
  const projects = await Project.find({ userId }).select('_id');
  const projectIds = projects.map((p) => p._id);

  const runs = await AnalysisRun.find({ projectId: { $in: projectIds } }).sort({ createdAt: -1 });

  let testsAnalysed = 0;
  let passedExecution = 0;
  let failedExecution = 0;
  let survivingMutations = 0;
  let killedMutants = 0;
  let weakAssertions = 0;
  let missingScenarios = 0;

  for (const run of runs) {
    testsAnalysed += run.summaryMetrics.totalTests || 0;
    passedExecution += run.summaryMetrics.passedExecution || 0;
    failedExecution += run.summaryMetrics.failedExecution || 0;
    survivingMutations += run.summaryMetrics.survivedMutants || 0;
    killedMutants += run.summaryMetrics.killedMutants || 0;
    weakAssertions += run.summaryMetrics.weakAssertionsCount || 0;
    missingScenarios += run.summaryMetrics.missingScenariosCount || 0;
  }

  // Findings by severity across user's projects
  const findingsBySeverity = await Finding.aggregate([
    { $match: { projectId: { $in: projectIds } } },
    { $group: { _id: '$severity', count: { $sum: 1 } } },
  ]);

  const severityCounts: Record<string, number> = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    info: 0,
  };
  findingsBySeverity.forEach((item) => {
    if (severityCounts[item._id] !== undefined) {
      severityCounts[item._id] = item.count;
    }
  });

  // Recent activity
  const recentRuns = await AnalysisRun.find({ projectId: { $in: projectIds } })
    .populate('projectId', 'name')
    .sort({ createdAt: -1 })
    .limit(8);

  // Overall Kill Rate calculation with formula disclosure
  const totalMutants = killedMutants + survivingMutations;
  const killRate = totalMutants > 0 ? Number(((killedMutants / totalMutants) * 100).toFixed(1)) : 0;

  res.status(200).json({
    metrics: {
      totalProjects,
      testsAnalysed,
      passedExecution,
      failedExecution,
      survivingMutations,
      killedMutants,
      totalMutants,
      killRate,
      weakAssertions,
      missingScenarios,
    },
    severityCounts,
    recentRuns,
    formulaDocumentation: {
      metric: 'Mutation Kill Rate (%)',
      formula: '(Killed Mutants / Total Generated Mutants) * 100',
      description:
        'Measures the fraction of synthetically introduced code defects that caused at least one test to fail.',
      inherentLimitations: [
        'Equivalent Mutants: Some mutants produce behaviorally identical code and cannot be killed by any valid test.',
        'Not a Proof: A 100% kill rate does NOT mathematically prove the absence of unspecified defects.',
        'Passing Tests Without Assertions: Tests that simply execute code without assertions will cause mutants to survive unless an unhandled error is thrown.',
      ],
    },
  });
}

export async function listProjectRuns(req: AuthRequest, res: Response): Promise<void> {
  const { projectId } = req.params;
  const userId = req.user!.userId;

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    res.status(400).json({ error: 'Invalid project ID' });
    return;
  }

  const project = await Project.findOne({ _id: projectId, userId });
  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }

  const runs = await AnalysisRun.find({ projectId }).sort({ createdAt: -1 });

  res.status(200).json({ runs });
}

export async function getRunDetails(req: AuthRequest, res: Response): Promise<void> {
  const { runId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(runId)) {
    res.status(400).json({ error: 'Invalid run ID' });
    return;
  }

  const run = await AnalysisRun.findById(runId).populate('projectId', 'name framework language');
  if (!run) {
    res.status(404).json({ error: 'Analysis run not found' });
    return;
  }

  const findings = await Finding.find({ runId }).sort({ severity: 1 });
  const mutations = await MutationResult.find({ runId }).limit(100);
  const execution = await ExecutionResult.findOne({ runId });

  res.status(200).json({
    run,
    findings,
    mutations,
    execution,
  });
}

export async function deleteRun(req: AuthRequest, res: Response): Promise<void> {
  const { runId } = req.params;
  const userId = req.user!.userId;

  if (!mongoose.Types.ObjectId.isValid(runId)) {
    res.status(400).json({ error: 'Invalid run ID' });
    return;
  }

  const run = await AnalysisRun.findOne({ _id: runId, userId });
  if (!run) {
    res.status(404).json({ error: 'Analysis run not found' });
    return;
  }

  const projectId = run.projectId;

  await Promise.all([
    AnalysisRun.deleteOne({ _id: runId }),
    Finding.deleteMany({ runId }),
    MutationResult.deleteMany({ runId }),
    ExecutionResult.deleteMany({ runId }),
  ]);

  // Update project stats to reflect remaining runs if any
  const latestRun = await AnalysisRun.findOne({ projectId, status: 'completed' }).sort({ createdAt: -1 });
  const project = await Project.findById(projectId);
  if (project) {
    if (latestRun) {
      project.stats.lastRunAt = latestRun.createdAt;
      project.stats.lastFindingsCount = latestRun.summaryMetrics.totalFindings;
      project.stats.lastMutationKillRate = latestRun.summaryMetrics.mutationKillRate;
    } else {
      project.stats.lastRunAt = undefined;
      project.stats.lastFindingsCount = 0;
      project.stats.lastMutationKillRate = 0;
    }
    await project.save();
  }

  res.status(200).json({ message: 'Audit run and associated data deleted successfully' });
}

export async function exportRunJson(req: AuthRequest, res: Response): Promise<void> {
  const { runId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(runId)) {
    res.status(400).json({ error: 'Invalid run ID' });
    return;
  }

  const run = await AnalysisRun.findById(runId).populate('projectId', 'name framework language description');
  if (!run) {
    res.status(404).json({ error: 'Analysis run not found' });
    return;
  }

  const findings = await Finding.find({ runId }).sort({ severity: 1 });
  const mutations = await MutationResult.find({ runId });
  const execution = await ExecutionResult.findOne({ runId });

  const reportPayload = {
    reportType: 'TestTruth Defensible Reliability Audit',
    version: '2.0.0',
    generatedAt: new Date().toISOString(),
    honestyPrinciples: run.honestyDisclosures,
    project: run.projectId,
    run: {
      id: run._id,
      status: run.status,
      runMode: run.runModeLabel,
      isIncremental: run.isIncremental,
      changedFilesCount: run.changedFilesCount,
      reusedMutantsCount: run.reusedMutantsCount,
      startedAt: run.startedAt,
      completedAt: run.completedAt,
      summaryMetrics: run.summaryMetrics,
      executionSandbox: run.executionSandbox,
      dockerAvailable: run.dockerAvailable,
    },
    baselineExecution: execution,
    findings,
    mutations,
  };

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename="testtruth-report-${runId}.json"`);
  res.status(200).send(JSON.stringify(reportPayload, null, 2));
}


