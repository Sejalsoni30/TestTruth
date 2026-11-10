import { Router } from 'express';
import {
  getDashboardMetrics,
  listProjectRuns,
  getRunDetails,
} from '../controllers/runController.js';
import { requireAuth } from '../middleware/auth.js';

export const runRouter = Router();

runRouter.use(requireAuth);

runRouter.get('/dashboard-metrics', getDashboardMetrics);
runRouter.get('/project/:projectId', listProjectRuns);
runRouter.get('/:runId', getRunDetails);

