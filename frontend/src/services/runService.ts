import { jsPDF } from 'jspdf';
import { request } from './api.js';
import { DashboardMetrics, AnalysisRun, Finding, MutationResult, RunStatusResponse } from '../types/index.js';

export interface RunDetailsResponse {
  run: AnalysisRun;
  findings: Finding[];
  mutations: MutationResult[];
  execution?: any;
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

  async startAnalysisRun(projectId: string, forceFullRun = false): Promise<{ message: string; runId: string; status: string }> {
    return request<{ message: string; runId: string; status: string }>('/runs/start', {
      method: 'POST',
      body: JSON.stringify({ projectId, forceFullRun }),
    });
  },

  async getRunStatus(runId: string): Promise<RunStatusResponse> {
    return request<RunStatusResponse>(`/runs/${runId}/status`);
  },

  async deleteRun(runId: string): Promise<{ message: string }> {
    return request<{ message: string }>(`/runs/${runId}`, {
      method: 'DELETE',
    });
  },

  downloadJson(runId: string, payload: any): void {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(payload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `testtruth-report-${runId}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  },

  generatePdfReport(details: RunDetailsResponse): void {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const run = details.run;
    const projName = typeof run.projectId === 'object' && run.projectId !== null ? (run.projectId as any).name : 'Test Suite';
    const framework = typeof run.projectId === 'object' && run.projectId !== null ? (run.projectId as any).framework : 'custom';
    const metrics = run.summaryMetrics;
    const duration = ((run.executionSandbox?.durationMs || 0) / 1000).toFixed(1);

    // Header Background banner
    doc.setFillColor(42, 33, 39); // Mauve 950 #2A2127
    doc.rect(0, 0, 210, 32, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(247, 239, 231); // #F7EFE7
    doc.text('TestTruth Reliability Audit Report', 14, 15);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(199, 169, 162); // #C7A9A2
    doc.text(`Official Test Quality & Mutation Verification Telemetry | Run ID: ${run._id}`, 14, 23);

    // Section 1: Project & Execution Metadata
    let y = 42;
    doc.setTextColor(62, 50, 57);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('1. Project & Execution Metadata', 14, y);

    y += 7;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 85, 96);
    doc.text(`Project Name: ${projName}`, 14, y);
    doc.text(`Framework: ${framework.toUpperCase()} | Language: JavaScript/TypeScript`, 110, y);

    y += 5;
    doc.text(`Run Mode: ${run.runModeLabel || (run.isIncremental ? 'Incremental run' : 'Full run')}`, 14, y);
    doc.text(`Sandbox: ${run.dockerAvailable ? 'Docker Isolated Container' : 'Process Sandbox Watchdog'}`, 110, y);

    y += 5;
    doc.text(`Executed At: ${new Date(run.createdAt).toLocaleString()}`, 14, y);
    doc.text(`Duration: ${duration}s | Status: ${run.status.toUpperCase()}`, 110, y);

    // Section 2: Metrics Summary
    y += 12;
    doc.setTextColor(62, 50, 57);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('2. Reliability & Mutation Score', 14, y);

    y += 7;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 85, 96);
    doc.text(`Baseline Tests: ${metrics?.passedExecution || 0} passed, ${metrics?.failedExecution || 0} failed (${metrics?.totalTests || 0} total)`, 14, y);
    doc.text(`Mutation Kill Rate: ${metrics?.mutationKillRate || 0}%`, 110, y);

    y += 5;
    doc.text(`Mutants Killed: ${metrics?.killedMutants || 0} | Mutants Survived: ${metrics?.survivedMutants || 0} (Total: ${metrics?.totalMutants || 0})`, 14, y);
    doc.text(`Cached Mutants Reused: ${run.reusedMutantsCount || 0}`, 110, y);

    y += 5;
    doc.text(`Formula: (Killed Mutants / Total Generated Mutants) * 100`, 14, y);

    // Section 3: Inherent Limitations (Honesty Principle)
    y += 12;
    doc.setFillColor(239, 225, 214); // surface-soft #EFE1D6
    doc.rect(14, y, 182, 22, 'F');
    doc.setTextColor(168, 69, 107); // accent #A8456B
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('Scientific Honesty Principle:', 18, y + 6);
    doc.setTextColor(62, 50, 57);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(
      'A surviving mutant is measurable evidence of a possible test blind spot, not mathematical proof of a bug.',
      18,
      y + 11
    );
    doc.text(
      'TestTruth never claims a test suite is "100% bug-free". High kill rates indicate test suite sensitivity, not the absence of unspecified defects.',
      18,
      y + 16
    );

    // Section 4: AST Findings
    y += 32;
    doc.setTextColor(62, 50, 57);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`3. Test Reliability Findings (${details.findings.length} detected)`, 14, y);

    y += 7;
    doc.setFontSize(8);
    details.findings.slice(0, 5).forEach((f) => {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(f.severity === 'critical' ? 179 : f.severity === 'high' ? 199 : 107, f.severity === 'critical' ? 38 : f.severity === 'high' ? 91 : 85, f.severity === 'critical' ? 30 : f.severity === 'high' ? 18 : 96);
      doc.text(`[${f.severity.toUpperCase()}] ${f.title}`, 14, y);

      y += 4;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(107, 85, 96);
      doc.text(`Location: ${f.filePath}:${f.line} | Rule: ${f.ruleId} | Confidence: ${f.confidence.toUpperCase()} (${f.confidenceScore}%)`, 14, y);

      y += 4;
      doc.setTextColor(62, 50, 57);
      doc.text(`Why: ${f.whyUnreliable.slice(0, 110)}${f.whyUnreliable.length > 110 ? '...' : ''}`, 14, y);

      y += 4;
      doc.setTextColor(168, 69, 107);
      doc.text(`Fix: ${f.suggestedFix.slice(0, 110)}${f.suggestedFix.length > 110 ? '...' : ''}`, 14, y);
      y += 5;
    });

    // Page 2: Mutation Matrix & Reproduction Steps
    doc.addPage();

    // Page 2 header
    doc.setFillColor(42, 33, 39);
    doc.rect(0, 0, 210, 18, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(247, 239, 231);
    doc.text('TestTruth Audit Report — Mutation Results & Remediation', 14, 12);

    let y2 = 28;
    doc.setTextColor(62, 50, 57);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`4. Mutation Testing Results Matrix (Showing ${Math.min(details.mutations.length, 10)} of ${details.mutations.length})`, 14, y2);

    y2 += 8;
    doc.setFontSize(8);
    details.mutations.slice(0, 10).forEach((m) => {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(m.status === 'killed' ? 79 : 179, m.status === 'killed' ? 122 : 38, m.status === 'killed' ? 92 : 30);
      doc.text(`[${m.status.toUpperCase()}] ${m.category.toUpperCase()} at ${m.filePath}:${m.line}`, 14, y2);

      y2 += 4;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(107, 85, 96);
      doc.text(`Mutated: "${m.originalCodeSnippet.trim()}" -> "${m.mutatedCodeSnippet.trim()}"`, 14, y2);

      if (m.killingTestName) {
        y2 += 4;
        doc.setTextColor(79, 122, 92);
        doc.text(`Killing Test: ${m.killingTestName}`, 14, y2);
      }
      y2 += 5;
    });

    // Section 5: Recommendations & Next Steps
    y2 += 8;
    doc.setTextColor(62, 50, 57);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('5. Recommendations for Engineers', 14, y2);

    y2 += 7;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 85, 96);
    doc.text('1. Add boundary and value assertions for all tests identified with TEST-NO-ASSERTION and TEST-SHALLOW-TRUTHINESS.', 14, y2);
    y2 += 5;
    doc.text('2. Introduce negative test cases asserting expected thrown exceptions for unasserted error paths.', 14, y2);
    y2 += 5;
    doc.text('3. Integrate TestTruth in CI/CD pipeline to block pull requests with surviving mutations.', 14, y2);

    // Footer on Page 2
    doc.setFontSize(7);
    doc.setTextColor(158, 129, 137);
    doc.text('Generated by TestTruth Analysis Engine. Certified reproducible audit artifact.', 14, 285);

    // Trigger browser download
    doc.save(`testtruth-audit-${run._id}.pdf`);
  },
};



