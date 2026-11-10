import { Response } from 'express';
import { z } from 'zod';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs/promises';
import { Project } from '../models/Project.js';
import { SourceFile } from '../models/SourceFile.js';
import { AnalysisRun } from '../models/AnalysisRun.js';
import { Finding } from '../models/Finding.js';
import { MutationResult } from '../models/MutationResult.js';
import { AuthRequest } from '../middleware/auth.js';
import { validateAndExtractZip } from '../utils/zipValidator.js';

const createProjectSchema = z.object({
  name: z.string().min(2, 'Project name must be at least 2 characters').max(60),
  description: z.string().max(300).optional().default(''),
  framework: z.enum(['jest', 'vitest', 'custom', 'unknown']).optional().default('jest'),
  language: z.enum(['javascript', 'typescript', 'mixed']).optional().default('javascript'),
});

const deleteProjectSchema = z.object({
  confirmProjectName: z.string().min(1, 'Please confirm project name'),
});

export async function createProject(req: AuthRequest, res: Response): Promise<void> {
  const { name, description, framework, language } = createProjectSchema.parse(req.body);
  const userId = req.user!.userId;

  const project = await Project.create({
    name,
    description,
    userId,
    framework,
    language,
    stats: {
      totalFiles: 0,
      sourceFilesCount: 0,
      testFilesCount: 0,
      lastFindingsCount: 0,
      lastMutationKillRate: 0,
    },
  });

  res.status(201).json({
    message: 'Project created successfully',
    project,
  });
}

export async function listProjects(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user!.userId;
  const projects = await Project.find({ userId }).sort({ updatedAt: -1 });

  res.status(200).json({ projects });
}

export async function getProject(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const userId = req.user!.userId;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ error: 'Invalid project ID format' });
    return;
  }

  const project = await Project.findOne({ _id: id, userId });
  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }

  // Fetch project files
  const files = await SourceFile.find({ projectId: project._id })
    .select('-content') // exclude large file content in project overview
    .sort({ relativePath: 1 });

  // Fetch recent runs
  const runs = await AnalysisRun.find({ projectId: project._id })
    .sort({ createdAt: -1 })
    .limit(5);

  res.status(200).json({
    project,
    files,
    runs,
  });
}

export async function deleteProject(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const userId = req.user!.userId;
  const { confirmProjectName } = deleteProjectSchema.parse(req.body);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ error: 'Invalid project ID' });
    return;
  }

  const project = await Project.findOne({ _id: id, userId });
  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }

  if (project.name !== confirmProjectName) {
    res.status(400).json({
      error: `Confirmation mismatch. Entered "${confirmProjectName}", but project is "${project.name}"`,
    });
    return;
  }

  // Cascade delete all associated data
  await Promise.all([
    Project.deleteOne({ _id: id }),
    SourceFile.deleteMany({ projectId: id }),
    AnalysisRun.deleteMany({ projectId: id }),
    Finding.deleteMany({ projectId: id }),
    MutationResult.deleteMany({ projectId: id }),
  ]);

  res.status(200).json({
    message: `Project "${project.name}" and all associated data deleted successfully`,
  });
}

export async function uploadProjectFiles(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const userId = req.user!.userId;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ error: 'Invalid project ID' });
    return;
  }

  const project = await Project.findOne({ _id: id, userId });
  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }

  const files = req.files as Express.Multer.File[] | undefined;
  const singleFile = req.file;
  const allFiles = files || (singleFile ? [singleFile] : []);

  if (!allFiles || allFiles.length === 0) {
    res.status(400).json({ error: 'No files provided for upload.' });
    return;
  }

  // Clear existing project files or update
  await SourceFile.deleteMany({ projectId: project._id });

  let sourceFilesCount = 0;
  let testFilesCount = 0;
  let totalFiles = 0;

  const tempExtractBase = path.join(process.cwd(), 'temp', `upload_${project._id}_${Date.now()}`);
  await fs.mkdir(tempExtractBase, { recursive: true });

  try {
    for (const file of allFiles) {
      if (
        file.mimetype === 'application/zip' ||
        file.mimetype === 'application/x-zip-compressed' ||
        file.originalname.endsWith('.zip')
      ) {
        // Handle ZIP extraction with strict zip-slip protection
        const entries = validateAndExtractZip(file.buffer, tempExtractBase);

        for (const entry of entries) {
          if (!entry.isText) continue;

          const content = entry.getData().toString('utf8');
          const ext = path.extname(entry.entryName).toLowerCase();
          const isTs = ext === '.ts' || ext === '.tsx';
          const isJs = ext === '.js' || ext === '.jsx' || ext === '.mjs' || ext === '.cjs';

          let fileType: 'source' | 'test' | 'config' | 'other' = 'other';
          if (
            entry.entryName.includes('.test.') ||
            entry.entryName.includes('.spec.') ||
            entry.entryName.includes('__tests__') ||
            entry.entryName.includes('tests/')
          ) {
            fileType = 'test';
            testFilesCount++;
          } else if (isTs || isJs) {
            fileType = 'source';
            sourceFilesCount++;
          } else if (entry.entryName.includes('config') || ext === '.json') {
            fileType = 'config';
          }

          totalFiles++;

          await SourceFile.create({
            projectId: project._id,
            relativePath: entry.entryName,
            fileType,
            language: isTs ? 'typescript' : 'javascript',
            content,
            sizeBytes: entry.size,
          });
        }
      } else {
        // Individual source file
        const ext = path.extname(file.originalname).toLowerCase();
        const isTs = ext === '.ts' || ext === '.tsx';
        const isTest =
          file.originalname.includes('.test.') ||
          file.originalname.includes('.spec.');

        const fileType = isTest ? 'test' : 'source';
        if (isTest) testFilesCount++;
        else sourceFilesCount++;
        totalFiles++;

        await SourceFile.create({
          projectId: project._id,
          relativePath: file.originalname,
          fileType,
          language: isTs ? 'typescript' : 'javascript',
          content: file.buffer.toString('utf8'),
          sizeBytes: file.size,
        });
      }
    }

    // Auto-detect framework
    const packageJsonFile = await SourceFile.findOne({
      projectId: project._id,
      relativePath: /package\.json$/i,
    });

    let detectedFramework: 'jest' | 'vitest' | 'custom' | 'unknown' = project.framework;
    if (packageJsonFile) {
      try {
        const pkg = JSON.parse(packageJsonFile.content);
        const deps = { ...pkg.dependencies, ...pkg.devDependencies };
        if (deps.vitest) detectedFramework = 'vitest';
        else if (deps.jest) detectedFramework = 'jest';
      } catch (e) {
        // ignore JSON parse error in package.json
      }
    }

    project.stats.totalFiles = totalFiles;
    project.stats.sourceFilesCount = sourceFilesCount;
    project.stats.testFilesCount = testFilesCount;
    project.framework = detectedFramework;
    await project.save();

    res.status(200).json({
      message: `Uploaded and processed ${totalFiles} files (${sourceFilesCount} source, ${testFilesCount} tests).`,
      stats: project.stats,
      framework: project.framework,
    });
  } finally {
    // Clean up temporary extraction folder
    try {
      await fs.rm(tempExtractBase, { recursive: true, force: true });
    } catch {
      // Ignore cleanup error
    }
  }
}

