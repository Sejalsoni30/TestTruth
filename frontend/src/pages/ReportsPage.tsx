import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useProject } from '../context/ProjectContext.js';
import { runService, RunDetailsResponse } from '../services/runService.js';
import { AnalysisRun, Finding, MutationResult } from '../types/index.js';
import { Card } from '../components/common/Card.js';
import { Button } from '../components/common/Button.js';
import { Badge } from '../components/common/Badge.js';
import { Modal } from '../components/common/Modal.js';
import {
  FileText,
  Download,
  Share2,
  Trash2,
  Eye,
  Search,
  Filter,
  ArrowUpDown,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowLeft,
  Sparkles,
  Play,
  Cpu,
  Terminal,
  ShieldCheck,
  Dna,
  Code2,
  Layers,
  Copy,
  Check,
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { runId: routeRunId } = useParams<{ runId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryRunId = searchParams.get('runId');
  const activeRunId = routeRunId || queryRunId;

  const { activeProject } = useProject();
  const navigate = useNavigate();

  // Runs table state
  const [runs, setRuns] = useState<AnalysisRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Sorting state
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | '7days' | '30days'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest_score' | 'lowest_score'>('newest');

  // Active Report Detail state
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState<RunDetailsResponse | null>(null);

  // Delete modal state
  const [deleteRunId, setDeleteRunId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Share link feedback toast
  const [copiedToast, setCopiedToast] = useState(false);

  // Load runs for current project
  useEffect(() => {
    if (activeProject) {
      loadProjectRuns(activeProject._id);
    } else {
      setRuns([]);
      setLoading(false);
    }
  }, [activeProject]);

  // Load report detail if activeRunId is specified
  useEffect(() => {
    if (activeRunId) {
      loadReportDetails(activeRunId);
    } else {
      setSelectedReport(null);
    }
  }, [activeRunId]);

  const loadProjectRuns = async (projectId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await runService.listProjectRuns(projectId);
      setRuns(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load project audit runs');
    } finally {
      setLoading(false);
    }
  };

  const loadReportDetails = async (runId: string) => {
    setDetailLoading(true);
    setError(null);
    try {
      const details = await runService.getRunDetails(runId);
      setSelectedReport(details);
    } catch (err: any) {
      setError(err.message || 'Failed to load report details');
      setSelectedReport(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleDeleteRun = async () => {
    if (!deleteRunId) return;
    setIsDeleting(true);
    try {
      await runService.deleteRun(deleteRunId);
      setDeleteRunId(null);
      if (activeRunId === deleteRunId) {
        navigate('/reports');
      }
      if (activeProject) {
        await loadProjectRuns(activeProject._id);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete audit run');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShareLink = (runId: string) => {
    const url = `${window.location.origin}/reports/${runId}`;
    navigator.clipboard.writeText(url);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  const handleDownloadPdf = async (runId: string) => {
    try {
      const details = selectedReport?.run._id === runId ? selectedReport : await runService.getRunDetails(runId);
      runService.generatePdfReport(details);
    } catch (err: any) {
      alert('Failed to generate PDF report: ' + err.message);
    }
  };

  const handleDownloadJson = async (runId: string) => {
    try {
      const details = selectedReport?.run._id === runId ? selectedReport : await runService.getRunDetails(runId);
      runService.downloadJson(runId, details);
    } catch (err: any) {
      alert('Failed to download JSON report: ' + err.message);
    }
  };

  // Filter and sort runs
  const filteredRuns = runs.filter((r) => {
    // Search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchLabel = (r.runModeLabel || '').toLowerCase().includes(query);
      const matchId = r._id.toLowerCase().includes(query);
      const matchStatus = r.status.toLowerCase().includes(query);
      if (!matchLabel && !matchId && !matchStatus) return false;
    }

    // Date filter
    if (dateFilter !== 'all') {
      const runDate = new Date(r.createdAt).getTime();
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000;
      if (dateFilter === 'today' && now - runDate > oneDay) return false;
      if (dateFilter === '7days' && now - runDate > 7 * oneDay) return false;
      if (dateFilter === '30days' && now - runDate > 30 * oneDay) return false;
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    if (sortBy === 'highest_score') return (b.summaryMetrics?.mutationKillRate || 0) - (a.summaryMetrics?.mutationKillRate || 0);
    if (sortBy === 'lowest_score') return (a.summaryMetrics?.mutationKillRate || 0) - (b.summaryMetrics?.mutationKillRate || 0);
    return 0;
  });

  // -------------------------------------------------------------
  // DETAIL REPORT VIEW (When a run is selected)
  // -------------------------------------------------------------
  if (activeRunId && selectedReport) {
    const { run, findings, mutations, execution } = selectedReport;
    const metrics = run.summaryMetrics;
    const duration = ((run.executionSandbox?.durationMs || 0) / 1000).toFixed(1);
    const projName = typeof run.projectId === 'object' && run.projectId !== null ? (run.projectId as any).name : 'Test Suite';
    const framework = typeof run.projectId === 'object' && run.projectId !== null ? (run.projectId as any).framework : 'custom';

    return (
      <div className="space-y-8">
        {/* Top Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-4">
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="outline"
              leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
              onClick={() => navigate('/reports')}
            >
              Back to Reports
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-body tracking-tight">Audit Report</h1>
                <Badge variant={run.isIncremental ? 'medium' : 'accent'}>
                  {run.runModeLabel || (run.isIncremental ? 'Incremental' : 'Full run')}
                </Badge>
                <Badge variant={run.status === 'completed' ? 'low' : 'critical'}>
                  {run.status.toUpperCase()}
                </Badge>
              </div>
              <p className="text-xs text-muted font-mono mt-0.5">
                Run ID: {run._id} • Executed {new Date(run.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              size="sm"
              variant="secondary"
              leftIcon={<Share2 className="w-3.5 h-3.5" />}
              onClick={() => handleShareLink(run._id)}
            >
              Share link
            </Button>
            <Button
              size="sm"
              variant="outline"
              leftIcon={<Download className="w-3.5 h-3.5" />}
              onClick={() => handleDownloadJson(run._id)}
            >
              Download JSON
            </Button>
            <Button
              size="sm"
              variant="primary"
              leftIcon={<Download className="w-3.5 h-3.5" />}
              onClick={() => handleDownloadPdf(run._id)}
            >
              Download PDF
            </Button>
          </div>
        </div>

        {copiedToast && (
          <div className="p-3 bg-low/15 border border-low/30 rounded-xl text-low text-xs flex items-center gap-2 animate-fade-in">
            <Check className="w-4 h-4" />
            <span>Direct audit report link copied to clipboard!</span>
          </div>
        )}

        {/* SECTION 1: PROJECT & RUN INFO */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
            <FileText className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-bold text-body uppercase tracking-wider font-mono">1. Project & Execution Information</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-3 bg-surface-soft rounded-xl border border-border">
              <span className="text-muted block text-[10px] uppercase font-semibold">PROJECT NAME</span>
              <span className="text-body font-bold">{projName}</span>
            </div>
            <div className="p-3 bg-surface-soft rounded-xl border border-border">
              <span className="text-muted block text-[10px] uppercase font-semibold">FRAMEWORK / LANGUAGE</span>
              <span className="text-body font-bold">{framework.toUpperCase()} (JavaScript)</span>
            </div>
            <div className="p-3 bg-surface-soft rounded-xl border border-border">
              <span className="text-muted block text-[10px] uppercase font-semibold">SANDBOX ENVIRONMENT</span>
              <span className="text-body font-bold">
                {run.dockerAvailable ? 'Docker Isolated' : 'Process Sandbox'}
              </span>
            </div>
            <div className="p-3 bg-surface-soft rounded-xl border border-border">
              <span className="text-muted block text-[10px] uppercase font-semibold">EXECUTION DURATION</span>
              <span className="text-body font-bold">{duration}s</span>
            </div>
          </div>
        </Card>

        {/* SECTION 2: SOURCE ANALYSIS & INCREMENTAL HASHING */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
            <Code2 className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-bold text-body uppercase tracking-wider font-mono">2. Source Code & Delta Analysis</h2>
          </div>
          <div className="space-y-3 text-xs leading-relaxed text-muted">
            <p>
              TestTruth computes SHA-256 content hashes for all project source files to selectively mutate modified files and reuse validated results for unchanged files.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-[11px]">
              <div className="p-3 bg-surface-soft rounded-xl border border-border">
                <span className="text-muted block text-[9px] uppercase font-semibold">RUN MODE</span>
                <span className="text-body font-semibold">{run.runModeLabel || (run.isIncremental ? 'Incremental' : 'Full run')}</span>
              </div>
              <div className="p-3 bg-surface-soft rounded-xl border border-border">
                <span className="text-muted block text-[9px] uppercase font-semibold">CHANGED FILES MUTATED</span>
                <span className="text-body font-semibold">{run.changedFilesCount || 0}</span>
              </div>
              <div className="p-3 bg-surface-soft rounded-xl border border-border">
                <span className="text-muted block text-[9px] uppercase font-semibold">CACHED MUTANTS REUSED</span>
                <span className="text-low font-semibold">{run.reusedMutantsCount || 0}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* SECTION 3: TEST SUITE ANALYSIS (BASELINE) */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
            <Terminal className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-bold text-body uppercase tracking-wider font-mono">3. Baseline Test Suite Execution</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs mb-4">
            <div className="p-3 bg-surface-soft rounded-xl border border-border flex items-center justify-between">
              <span className="text-muted">TOTAL TESTS:</span>
              <span className="text-body font-bold">{metrics?.totalTests || 0}</span>
            </div>
            <div className="p-3 bg-low/10 border border-low/20 rounded-xl flex items-center justify-between text-low">
              <span>PASSED (BASELINE):</span>
              <span className="font-bold">{metrics?.passedExecution || 0}</span>
            </div>
            <div className="p-3 bg-critical/10 border border-critical/20 rounded-xl flex items-center justify-between text-critical">
              <span>FAILED (BASELINE):</span>
              <span className="font-bold">{metrics?.failedExecution || 0}</span>
            </div>
          </div>

          {execution?.stdout && (
            <div className="mt-3">
              <span className="text-[10px] font-mono text-muted uppercase block mb-1">RAW TEST RUNNER OUTPUT:</span>
              <pre className="p-3 bg-code-bg text-code-text rounded-xl font-mono text-[11px] overflow-x-auto max-h-36 border border-border">
                {execution.stdout}
              </pre>
            </div>
          )}
        </Card>

        {/* SECTION 4: FINDINGS */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-accent" />
              <h2 className="text-sm font-bold text-body uppercase tracking-wider font-mono">
                4. Test Reliability Findings ({findings.length})
              </h2>
            </div>
          </div>

          {findings.length === 0 ? (
            <p className="text-xs text-muted">No weak assertions or unasserted execution paths detected.</p>
          ) : (
            <div className="space-y-3">
              {findings.map((f) => (
                <div key={f._id} className="p-4 rounded-xl border border-border bg-surface-soft/60 space-y-2 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={f.severity}>{f.severity.toUpperCase()}</Badge>
                      <Badge variant="weak">{f.classification}</Badge>
                      <span className="font-bold text-body">{f.title}</span>
                    </div>
                    <span className="font-mono text-muted text-[11px]">{f.filePath}:{f.line}</span>
                  </div>
                  <p className="text-body leading-relaxed">{f.whyUnreliable}</p>
                  {f.evidence?.actualAssertion && (
                    <div className="p-2.5 bg-code-bg text-[#F7EFE7] rounded-lg font-mono text-[11px]">
                      {f.evidence.actualAssertion}
                    </div>
                  )}
                  <div className="p-2.5 bg-surface rounded-lg border border-accent/30 font-mono text-[11px] text-body">
                    <span className="text-accent font-semibold block mb-0.5">SUGGESTED DEFENSIVE FIX:</span>
                    {f.suggestedFix}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* SECTION 5: MUTATION TESTING RESULTS */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Dna className="w-4 h-4 text-accent" />
              <h2 className="text-sm font-bold text-body uppercase tracking-wider font-mono">
                5. Mutation Testing Matrix ({metrics?.mutationKillRate || 0}% Kill Rate)
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs mb-4">
            <div className="p-3 bg-surface-soft rounded-xl border border-border">
              <span className="text-muted block text-[9px] uppercase font-semibold">TOTAL MUTANTS</span>
              <span className="text-body font-bold text-base">{metrics?.totalMutants || 0}</span>
            </div>
            <div className="p-3 bg-low/10 border border-low/20 rounded-xl text-low">
              <span className="block text-[9px] uppercase font-semibold">KILLED MUTANTS</span>
              <span className="font-bold text-base">{metrics?.killedMutants || 0}</span>
            </div>
            <div className="p-3 bg-critical/10 border border-critical/20 rounded-xl text-critical">
              <span className="block text-[9px] uppercase font-semibold">SURVIVED MUTANTS</span>
              <span className="font-bold text-base">{metrics?.survivedMutants || 0}</span>
            </div>
            <div className="p-3 bg-surface-soft rounded-xl border border-border">
              <span className="text-muted block text-[9px] uppercase font-semibold">KILL RATE</span>
              <span className="text-body font-bold text-base">{metrics?.mutationKillRate || 0}%</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-border text-[11px] text-muted uppercase">
                  <th className="py-2 px-2">Status</th>
                  <th className="py-2 px-2">Category</th>
                  <th className="py-2 px-2">Location</th>
                  <th className="py-2 px-2">Original Expression</th>
                  <th className="py-2 px-2">Mutated Expression</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {mutations.slice(0, 15).map((m) => (
                  <tr key={m._id} className="hover:bg-surface-soft/40">
                    <td className="py-2.5 px-2">
                      <Badge variant={m.status === 'killed' ? 'killed' : 'survived'} size="sm">
                        {m.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-2 font-semibold text-body">{m.category}</td>
                    <td className="py-2.5 px-2 text-muted">{m.filePath}:{m.line}</td>
                    <td className="py-2.5 px-2 text-critical truncate max-w-xs">{m.originalCodeSnippet}</td>
                    <td className="py-2.5 px-2 text-low truncate max-w-xs">{m.mutatedCodeSnippet}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* SECTION 6: MISSING SCENARIOS */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
            <Layers className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-bold text-body uppercase tracking-wider font-mono">6. Missing Boundary & Edge Scenarios</h2>
          </div>
          <div className="space-y-2 text-xs text-muted leading-relaxed">
            <p>
              Mutations survived across comparison operators, boundary thresholds, and exception branches without triggering test failures:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-body">
              <li>
                <strong>Threshold Inversions:</strong> Boundary checks (<code className="text-accent">&gt;=</code> vs <code className="text-accent">&gt;</code>) survived, indicating boundary values are untested.
              </li>
              <li>
                <strong>Arithmetic Operator Swaps:</strong> Logic operators (<code className="text-accent">+</code> to <code className="text-accent">-</code>) survived due to tautological or shallow checks.
              </li>
              <li>
                <strong>Unchecked Errors:</strong> Error-throwing paths were invoked without asserting that exceptions are raised.
              </li>
            </ul>
          </div>
        </Card>

        {/* SECTION 7: REPRODUCTION STEPS */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
            <Terminal className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-bold text-body uppercase tracking-wider font-mono">7. Engineer Reproduction Steps</h2>
          </div>
          <div className="space-y-3 text-xs font-mono">
            <p className="text-muted font-sans text-xs">
              To verify any surviving mutant in your local development environment:
            </p>
            <div className="p-3 bg-code-bg text-code-text rounded-xl border border-border space-y-2">
              <div className="text-muted"># 1. Open the file indicated in the mutation matrix:</div>
              <div>vim src/calculator.js</div>
              <div className="text-muted"># 2. Apply the synthetic mutation diff:</div>
              <div className="text-critical">- if (userCount &gt;= 50) return amount * 0.2;</div>
              <div className="text-low">+ if (userCount &gt; 50) return amount * 0.2;</div>
              <div className="text-muted"># 3. Run your project test suite:</div>
              <div>npm test</div>
              <div className="text-muted"># 4. Observe that tests report 100% GREEN, proving the test blind spot.</div>
            </div>
          </div>
        </Card>

        {/* SECTION 8: RECOMMENDATIONS */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
            <Sparkles className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-bold text-body uppercase tracking-wider font-mono">8. Actionable Remediation Recommendations</h2>
          </div>
          <div className="space-y-3 text-xs leading-relaxed">
            <div className="p-3 bg-surface-soft rounded-xl border border-border">
              <span className="font-bold text-body block mb-1">1. Replace Shallow Assertions with Invariant Checks</span>
              <p className="text-muted">
                Audit all tests currently using <code className="text-accent">toBeDefined()</code> or <code className="text-accent">assert.ok(res !== undefined)</code>. Replace them with exact value matches or schema postcondition validations.
              </p>
            </div>
            <div className="p-3 bg-surface-soft rounded-xl border border-border">
              <span className="font-bold text-body block mb-1">2. Add Explicit Boundary Value Tests</span>
              <p className="text-muted">
                For every conditional branch, add tests evaluating the exact boundary thresholds (e.g., test input values <code className="text-accent">n - 1</code>, <code className="text-accent">n</code>, and <code className="text-accent">n + 1</code>).
              </p>
            </div>
            <div className="p-3 bg-surface-soft rounded-xl border border-border">
              <span className="font-bold text-body block mb-1">3. Guard CI/CD Against Surviving Mutants</span>
              <p className="text-muted">
                Configure TestTruth in your GitHub Actions workflow to block pull requests where new or modified code introduces surviving mutants.
              </p>
            </div>
          </div>
        </Card>

        {/* SECTION 9: INHERENT LIMITATIONS */}
        <Card className="p-6 bg-surface-soft border-accent/30 shadow-elevation-sm">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-accent shrink-0 mt-0.5" />
            <div className="space-y-2 text-xs">
              <h2 className="text-sm font-bold text-body uppercase tracking-wider font-mono">
                9. Non-Negotiable Honesty Principle & Inherent Limitations
              </h2>
              <p className="text-body leading-relaxed">
                TestTruth delivers defensible empirical evidence, not infallible mathematical proofs. The metrics in this report represent the sensitivity of your tests to synthetic code modifications.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-muted">
                <li>
                  <strong>Surviving Mutants:</strong> A surviving mutant indicates a test blind spot, but may occasionally represent an equivalent mutant (a code change that is functionally identical to the original).
                </li>
                <li>
                  <strong>Kill Rate Limitations:</strong> A 100% mutation kill rate demonstrates that tests actively assert current behavior, but does not guarantee the absence of unspecified defects.
                </li>
                <li>
                  <strong>Deterministic Scope:</strong> Static AST rules detect recognized weak patterns; human engineering review remains vital.
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RUNS TABLE VIEW (Default Page)
  // -------------------------------------------------------------
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-body tracking-tight">Audit Reports & Exports</h1>
          <p className="text-xs text-muted mt-1">
            Browse, inspect, and export defensible test suite reliability reports for code reviews and compliance.
          </p>
        </div>
        <Button
          size="sm"
          variant="primary"
          leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
          onClick={() => navigate('/projects')}
        >
          Audit Suite
        </Button>
      </div>

      {copiedToast && (
        <div className="p-3 bg-low/15 border border-low/30 rounded-xl text-low text-xs flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4" />
          <span>Direct audit report link copied to clipboard!</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-critical/15 border border-critical/30 text-critical text-xs">
          {error}
        </div>
      )}

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search runs by mode, ID, or status..."
              className="w-full bg-surface-soft border border-border rounded-xl pl-9 pr-3.5 py-2 text-xs text-body focus:outline-none focus:border-accent"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Date filter */}
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-muted" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as any)}
                className="bg-surface-soft border border-border rounded-xl px-2.5 py-1.5 text-xs text-body focus:outline-none focus:border-accent"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
              </select>
            </div>

            {/* Sorting */}
            <div className="flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-muted" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-surface-soft border border-border rounded-xl px-2.5 py-1.5 text-xs text-body focus:outline-none focus:border-accent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest_score">Highest Kill Rate</option>
                <option value="lowest_score">Lowest Kill Rate</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Reports Table / Empty State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-16 space-y-3">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-muted font-mono">Loading audit reports history...</p>
        </div>
      ) : filteredRuns.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="w-12 h-12 text-muted/60 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-body">No runs yet</h3>
          <p className="text-xs text-muted max-w-sm mx-auto mt-1 mb-5 leading-relaxed">
            {activeProject
              ? `No test audit runs have been generated for ${activeProject.name} yet.`
              : 'Select a project and run an audit to generate defensible quality reports.'}
          </p>
          <Button size="md" variant="primary" onClick={() => navigate('/projects')}>
            Audit Suite
          </Button>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-border bg-surface-soft/60 text-[11px] text-muted uppercase">
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Run Type</th>
                  <th className="py-3 px-4">
                    <div className="flex items-center gap-1 group relative cursor-help">
                      <span>Mutation Score</span>
                      <HelpCircle className="w-3.5 h-3.5 text-muted" />
                      <div className="hidden group-hover:block absolute left-0 bottom-full mb-1 w-56 p-2 bg-sidebar-bg text-sidebar-text text-[10px] rounded-lg shadow-lg z-20 normal-case font-sans">
                        Formula: (Killed Mutants / Total Generated Mutants) * 100
                      </div>
                    </div>
                  </th>
                  <th className="py-3 px-4">Findings By Severity</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredRuns.map((r) => {
                  const dateStr = new Date(r.createdAt).toLocaleString();
                  const killRate = r.summaryMetrics?.mutationKillRate || 0;
                  const weakCount = r.summaryMetrics?.weakAssertionsCount || 0;
                  const runOnlyCount = r.summaryMetrics?.runOnlyTestsCount || 0;
                  const totalFindings = r.summaryMetrics?.totalFindings || 0;

                  return (
                    <tr key={r._id} className="hover:bg-surface-soft/40 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-body">
                        <div>{dateStr}</div>
                        <span className="text-[10px] text-muted font-normal">ID: {r._id.slice(-6)}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <Badge variant={r.isIncremental ? 'medium' : 'accent'} size="sm">
                          {r.runModeLabel || (r.isIncremental ? 'Incremental' : 'Full run')}
                        </Badge>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-body text-sm">
                          <span className={killRate >= 70 ? 'text-low' : 'text-critical'}>{killRate}%</span>
                        </div>
                        <span className="text-[10px] text-muted block">
                          {r.summaryMetrics?.killedMutants || 0} killed / {r.summaryMetrics?.totalMutants || 0} total
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {runOnlyCount > 0 && (
                            <Badge variant="critical" size="sm">
                              {runOnlyCount} run-only
                            </Badge>
                          )}
                          {weakCount > 0 && (
                            <Badge variant="high" size="sm">
                              {weakCount} weak
                            </Badge>
                          )}
                          {totalFindings === 0 && (
                            <span className="text-low font-semibold text-[11px]">0 issues</span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <Badge
                          variant={r.status === 'completed' ? 'low' : r.status === 'failed' ? 'critical' : 'accent'}
                          size="sm"
                        >
                          {r.status.toUpperCase()}
                        </Badge>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => navigate(`/reports/${r._id}`)}
                            title="View full report"
                            className="p-1.5 rounded-lg text-muted hover:text-body hover:bg-surface-soft transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDownloadPdf(r._id)}
                            title="Download PDF report"
                            className="p-1.5 rounded-lg text-muted hover:text-body hover:bg-surface-soft transition-colors"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDownloadJson(r._id)}
                            title="Download JSON telemetry"
                            className="p-1.5 rounded-lg text-muted hover:text-body hover:bg-surface-soft transition-colors"
                          >
                            <Code2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleShareLink(r._id)}
                            title="Copy shareable report link"
                            className="p-1.5 rounded-lg text-muted hover:text-body hover:bg-surface-soft transition-colors"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteRunId(r._id)}
                            title="Delete audit run"
                            className="p-1.5 rounded-lg text-muted hover:text-critical hover:bg-surface-soft transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteRunId !== null}
        onClose={() => setDeleteRunId(null)}
        title="Confirm Delete Audit Run"
      >
        <div className="space-y-4 text-xs">
          <p className="text-body leading-relaxed">
            Are you sure you want to permanently delete this audit run? This action will remove all recorded mutation testing executions, AST findings, and telemetry for this run.
          </p>
          <div className="p-3 bg-surface-soft rounded-xl font-mono text-[11px] text-body border border-border">
            Run ID: {deleteRunId}
          </div>
          <div className="pt-4 border-t border-border flex justify-end gap-2">
            <Button size="sm" variant="ghost" onClick={() => setDeleteRunId(null)}>
              Cancel
            </Button>
            <Button size="sm" variant="danger" isLoading={isDeleting} onClick={handleDeleteRun}>
              Delete Audit Run
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
