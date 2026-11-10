import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Project } from '../models/Project.js';
import { SourceFile } from '../models/SourceFile.js';
import { AnalysisRun } from '../models/AnalysisRun.js';
import { computeContentHash } from './fileHashService.js';
import { executeProjectAnalysis } from './analysisPipelineService.js';

/**
 * Seeds a standard starter project and completed baseline audit for a given user
 */
export async function seedUserWorkspace(userDoc: any): Promise<void> {
  const existingProject = await Project.findOne({ userId: userDoc._id });
  if (existingProject) {
    return;
  }

  const project = await Project.create({
    name: 'Weak Calculator (Sample Suite)',
    description: 'Demonstrates surviving mutants, zero-assertion tests, and shallow truthiness checks in JS/TS.',
    userId: userDoc._id,
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
          projectId: project._id,
          relativePath: item.rel,
          fileType: item.type,
          language: item.lang,
          content,
          contentHash: computeContentHash(content),
          sizeBytes: Buffer.byteLength(content, 'utf8'),
        });
      }
    }

    const run = await AnalysisRun.create({
      projectId: project._id,
      userId: userDoc._id,
      status: 'running',
      progressStage: 'queued',
      progressMessage: 'Initializing audit pipeline...',
      triggerType: 'manual',
      isIncremental: false,
      changedFilesCount: 0,
      reusedMutantsCount: 0,
      runModeLabel: 'Full run',
    });

    console.log(`[Seed] Executing baseline audit on project for ${userDoc.email} (${run._id})...`);
    await executeProjectAnalysis(run._id.toString(), true);
    console.log(`[Seed] Workspace initialized for ${userDoc.email} with real mutation results!`);
  }
}

export async function seedDemoDataIfEmpty(): Promise<void> {
  try {
    const accounts = [
      {
        email: 'demo@testtruth.io',
        name: 'Alex Rivera (Demo Lead)',
        role: 'admin' as const,
      },
      {
        email: 'user@gmail.com',
        name: 'Alex Soni',
        role: 'member' as const,
      },
    ];

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Password123!', salt);

    for (const acc of accounts) {
      let user = await User.findOne({ email: acc.email });
      if (!user) {
        console.log(`[Seed] Seeding evaluation user: ${acc.email}...`);
        user = await User.create({
          email: acc.email,
          passwordHash: hashedPassword,
          name: acc.name,
          role: acc.role,
        });
      }

      await seedUserWorkspace(user);
    }
  } catch (err) {
    console.error('[Seed] Warning: Demo seeding encountered an issue:', err);
  }
}
