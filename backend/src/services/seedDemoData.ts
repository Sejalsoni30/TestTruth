import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Project } from '../models/Project.js';
import { SourceFile } from '../models/SourceFile.js';
import { AnalysisRun } from '../models/AnalysisRun.js';
import { computeContentHash } from './fileHashService.js';
import { executeProjectAnalysis } from './analysisPipelineService.js';

export async function seedDemoDataIfEmpty(): Promise<void> {
  try {
    const existingUser = await User.findOne({ email: 'demo@testtruth.io' });
    if (existingUser) {
      return;
    }

    console.log('[Seed] Seeding demo workspace for immediate evaluation...');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Password123!', salt);

    const demoUser = await User.create({
      email: 'demo@testtruth.io',
      passwordHash: hashedPassword,
      name: 'Alex Rivera (Demo Lead)',
      role: 'admin',
    });

    const demoProject = await Project.create({
      name: 'Weak Calculator (Sample Suite)',
      description: 'Demonstrates surviving mutants, zero-assertion tests, and shallow truthiness checks in JS/TS.',
      userId: demoUser._id,
      framework: 'jest',
      language: 'javascript',
      stats: {
        totalFiles: 4,
        sourceFilesCount: 2,
        testFilesCount: 1,
        lastFindingsCount: 4,
        lastMutationKillRate: 7.1,
      },
    });

    // Read sample files from disk
    const samplesDir = path.resolve(process.cwd(), 'samples/weak-calculator');
    const altSamplesDir = path.resolve(process.cwd(), '../samples/weak-calculator');
    const targetDir = fs.existsSync(samplesDir) ? samplesDir : altSamplesDir;

    if (fs.existsSync(targetDir)) {
      const filesToSeed = [
        { rel: 'package.json', type: 'config' as const, lang: 'javascript' as const },
        { rel: 'src/calculator.js', type: 'source' as const, lang: 'javascript' as const },
        { rel: 'src/mathUtils.js', type: 'source' as const, lang: 'javascript' as const },
        { rel: 'test/calculator.test.js', type: 'test' as const, lang: 'javascript' as const },
      ];

      for (const item of filesToSeed) {
        const fullPath = path.join(targetDir, item.rel);
        if (fs.existsSync(fullPath)) {
          const content = fs.readFileSync(fullPath, 'utf8');
          await SourceFile.create({
            projectId: demoProject._id,
            relativePath: item.rel,
            fileType: item.type,
            language: item.lang,
            content,
            contentHash: computeContentHash(content),
            sizeBytes: Buffer.byteLength(content, 'utf8'),
          });
        }
      }

      // Create queued run and execute analysis
      const run = await AnalysisRun.create({
        projectId: demoProject._id,
        userId: demoUser._id,
        status: 'running',
        progressStage: 'queued',
        progressMessage: 'Initializing demo audit pipeline...',
        triggerType: 'manual',
        isIncremental: false,
        changedFilesCount: 0,
        reusedMutantsCount: 0,
        runModeLabel: 'Full run',
      });

      console.log(`[Seed] Executing baseline audit on sample project (${run._id})...`);
      await executeProjectAnalysis(run._id.toString(), true);
      console.log('[Seed] Demo workspace initialized with real mutation results and findings!');
    }
  } catch (err) {
    console.error('[Seed] Warning: Demo seeding encountered an issue:', err);
  }
}
