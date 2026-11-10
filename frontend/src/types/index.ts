export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'member';
  createdAt: string;
}

export interface ProjectStats {
  totalFiles: number;
  sourceFilesCount: number;
  testFilesCount: number;
  lastRunAt?: string;
  lastFindingsCount?: number;
  lastMutationKillRate?: number;
}

export interface Project {
  _id: string;
  name: string;
  description: string;
  userId: string;
  framework: 'jest' | 'vitest' | 'custom' | 'unknown';
  language: 'javascript' | 'typescript' | 'mixed';
  stats: ProjectStats;
  createdAt: string;
  updatedAt: string;
}

export interface SourceFileSummary {
  _id: string;
  projectId: string;
  relativePath: string;
  fileType: 'source' | 'test' | 'config' | 'other';
  language: 'javascript' | 'typescript';
  sizeBytes: number;
  astSummary?: {
    functions: Array<{
      name: string;
      line: number;
      endLine: number;
      params: string[];
      cyclomaticComplexity: number;
      branchesCount: number;
      hasErrorHandling: boolean;
    }>;
    branches: number;
    errorHandlersCount: number;
    imports: string[];
    associatedTests?: string[];
  };
}

export type FindingClassification =
  | 'Verified mismatch'
  | 'Surviving mutation'
  | 'Weak assertion'
  | 'Missing scenario'
  | 'Inconclusive';

export type FindingSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export interface Finding {
  _id: string;
  runId: string;
  projectId: string;
  classification: FindingClassification;
  severity: FindingSeverity;
  title: string;
  filePath: string;
  line: number;
  column?: number;
  whyUnreliable: string;
  suggestedFix: string;
  confidence: 'high' | 'medium' | 'low';
  confidenceScore: number;
  evidence: {
    snippet?: string;
    actualAssertion?: string;
    counterExampleInput?: string;
    mutatedCodeDiff?: string;
    details?: string;
  };
  ruleId: string;
  status: 'active' | 'resolved' | 'ignored';
  createdAt: string;
}

export interface MutationResult {
  _id: string;
  runId: string;
  projectId: string;
  filePath: string;
  line: number;
  category: 'operator' | 'boolean' | 'condition' | 'return_value' | 'boundary';
  description: string;
  originalCodeSnippet: string;
  mutatedCodeSnippet: string;
  diff: string;
  status: 'killed' | 'survived' | 'timeout' | 'error';
  killingTestName?: string;
  testOutput?: string;
  executionDurationMs?: number;
}

export interface Scenario {
  _id: string;
  runId?: string;
  projectId: string;
  targetFunction: string;
  scenarioType: 'normal' | 'boundary' | 'negative' | 'exception' | 'edge' | 'regression';
  name: string;
  inputDescription: string;
  inputData: any;
  expectedResult: any;
  reasoning: string;
  testCode: string;
  isUserStated: boolean;
  inferredAssumptions?: string[];
  clarificationNeeded?: string;
  counterexampleInput?: string;
  createdAt: string;
}

export interface AnalysisRun {
  _id: string;
  projectId: Project | string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  triggerType: 'manual' | 'ci' | 'upload';
  isIncremental?: boolean;
  changedFilesCount?: number;
  reusedMutantsCount?: number;
  runModeLabel?: string;
  progressStage?: 'queued' | 'running tests' | 'mutating' | 'analysing' | 'done' | 'failed';
  progressMessage?: string;
  dockerAvailable?: boolean;
  summaryMetrics: {
    totalTests: number;
    passedExecution: number;
    failedExecution: number;
    totalMutants: number;
    killedMutants: number;
    survivedMutants: number;
    mutationKillRate: number;
    weakAssertionsCount: number;
    runOnlyTestsCount: number;
    missingScenariosCount: number;
    totalFindings: number;
  };
  honestyDisclosures: string[];
  executionSandbox: {
    type: 'docker' | 'process_isolated';
    durationMs: number;
    exitCode: number;
    timedOut: boolean;
  };
  errorMessage?: string;
  startedAt: string;
  completedAt?: string;
  createdAt: string;
}

export interface RunStatusResponse {
  runId: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  progressStage: 'queued' | 'running tests' | 'mutating' | 'analysing' | 'done' | 'failed';
  progressMessage: string;
  isIncremental: boolean;
  changedFilesCount: number;
  reusedMutantsCount: number;
  runModeLabel: string;
  durationMs: number;
  dockerAvailable: boolean;
  summaryMetrics?: AnalysisRun['summaryMetrics'];
  errorMessage?: string;
}

export interface DashboardMetrics {
  metrics: {
    totalProjects: number;
    testsAnalysed: number;
    passedExecution: number;
    failedExecution: number;
    survivingMutations: number;
    killedMutants: number;
    totalMutants: number;
    killRate: number;
    weakAssertions: number;
    missingScenarios: number;
  };
  severityCounts: Record<string, number>;
  recentRuns: AnalysisRun[];
  formulaDocumentation: {
    metric: string;
    formula: string;
    description: string;
    inherentLimitations: string[];
  };
}

