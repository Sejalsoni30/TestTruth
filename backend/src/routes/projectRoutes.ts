import { Router } from 'express';
import {
  createProject,
  listProjects,
  getProject,
  deleteProject,
  uploadProjectFiles,
  getProjectFile,
  updateProjectFile,
} from '../controllers/projectController.js';
import { requireAuth } from '../middleware/auth.js';
import { uploadZipOrFiles } from '../middleware/uploadSecurity.js';

export const projectRouter = Router();

projectRouter.use(requireAuth);

projectRouter.post('/', createProject);
projectRouter.get('/', listProjects);
projectRouter.get('/:id', getProject);
projectRouter.delete('/:id', deleteProject);
projectRouter.post('/:id/upload', uploadZipOrFiles.array('files', 50), uploadProjectFiles);
projectRouter.get('/:id/files/:fileId', getProjectFile);
projectRouter.put('/:id/files/:fileId', updateProjectFile);

