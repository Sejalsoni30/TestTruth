import { Router } from 'express';
import {
  getDashboardMetrics,
  listProjectRuns,
  getRunDetails,
  startAnalysisRun,
  getRunStatus,
  deleteRun,
  exportRunJson,
} from '../controllers/runController.js';
import { requireAuth } from '../middleware/auth.js';

export const runRouter = Router();

runRouter.use(requireAuth);

runRouter.post('/start', startAnalysisRun);
runRouter.get('/dashboard-metrics', getDashboardMetrics);
runRouter.get('/project/:projectId', listProjectRuns);
runRouter.get('/:runId/status', getRunStatus);
runRouter.get('/:runId/export-json', exportRunJson);
runRouter.get('/:runId', getRunDetails);
runRouter.delete('/:runId', deleteRun);

