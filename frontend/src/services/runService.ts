import { request } from './api.js';
import { DashboardMetrics, AnalysisRun, Finding, MutationResult } from '../types/index.js';

export interface RunDetailsResponse {
  run: AnalysisRun;
  findings: Finding[];
  mutations: MutationResult[];
}

export const runService = {
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    return request<DashboardMetrics>('/runs/dashboard-metrics');
  },

  async listProjectRuns(projectId: string): Promise<AnalysisRun[]> {
    const res = await request<{ runs: AnalysisRun[] }>(`/runs/project/${projectId}`);
    return res.runs;
  },

  async getRunDetails(runId: string): Promise<RunDetailsResponse> {
    return request<RunDetailsResponse>(`/runs/${runId}`);
  },
};

