import { Response } from 'express';
import mongoose from 'mongoose';
import { Project } from '../models/Project.js';
import { AnalysisRun } from '../models/AnalysisRun.js';
import { Finding } from '../models/Finding.js';
import { MutationResult } from '../models/MutationResult.js';
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
  const mutations = await MutationResult.find({ runId }).limit(50);

  res.status(200).json({
    run,
    findings,
    mutations,
  });
}

