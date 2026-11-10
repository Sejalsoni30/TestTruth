import { request } from './api.js';
import { Project, SourceFileSummary, AnalysisRun } from '../types/index.js';

export interface ProjectDetailResponse {
  project: Project;
  files: SourceFileSummary[];
  runs: AnalysisRun[];
}

export const projectService = {
  async listProjects(): Promise<Project[]> {
    const res = await request<{ projects: Project[] }>('/projects');
    return res.projects;
  },

  async getProject(id: string): Promise<ProjectDetailResponse> {
    return request<ProjectDetailResponse>(`/projects/${id}`);
  },

  async createProject(data: {
    name: string;
    description?: string;
    framework?: string;
    language?: string;
  }): Promise<{ message: string; project: Project }> {
    return request<{ message: string; project: Project }>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async deleteProject(id: string, confirmProjectName: string): Promise<{ message: string }> {
    return request<{ message: string }>(`/projects/${id}`, {
      method: 'DELETE',
      body: JSON.stringify({ confirmProjectName }),
    });
  },

  async uploadFiles(projectId: string, formData: FormData): Promise<{
    message: string;
    stats: any;
    framework: string;
  }> {
    return request(`/projects/${projectId}/upload`, {
      method: 'POST',
      body: formData,
    });
  },
};

