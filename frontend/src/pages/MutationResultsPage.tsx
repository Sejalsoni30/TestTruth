import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useProject } from '../context/ProjectContext.js';
import { runService, RunDetailsResponse } from '../services/runService.js';
import { Card } from '../components/common/Card.js';
import { Button } from '../components/common/Button.js';
import { Badge } from '../components/common/Badge.js';
import {
  Dna,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCw,
  Play,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Filter,
  FileCode,
  ShieldCheck,
  Terminal,
} from 'lucide-react';

export const MutationResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const runIdParam = searchParams.get('runId');
  const { activeProject } = useProject();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [runDetails, setRunDetails] = useState<RunDetailsResponse | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'survived' | 'killed'>('all');
  const [expandedMutantId, setExpandedMutantId] = useState<string | null>(null);
  const [reRunning, setReRunning] = useState(false);

  useEffect(() => {
    loadData();
  }, [runIdParam, activeProject]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      let targetRunId = runIdParam;

      if (!targetRunId && activeProject) {
        // Fetch the most recent run for the active project
        const runs = await runService.listProjectRuns(activeProject._id);
        if (runs && runs.length > 0) {
          targetRunId = runs[0]._id;
        }
      }

      if (targetRunId) {
        const details = await runService.getRunDetails(targetRunId);
        setRunDetails(details);
      } else {
        setRunDetails(null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load mutation results');
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerRun = async (forceFullRun: boolean) => {
    if (!activeProject) return;
    setReRunning(true);
    try {
      const res = await runService.startAnalysisRun(activeProject._id, forceFullRun);
      navigate(`/projects`);
    } catch (err: any) {
      setError(err.message || 'Failed to trigger run');
      setReRunning(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 space-y-4">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-muted font-mono">Loading mutation audit telemetry...</p>
      </div>
    );
  }

  if (!runDetails || !runDetails.run) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-body tracking-tight">Mutation Testing Engine</h1>
          <p className="text-xs text-muted mt-1">
            Synthetic fault injection and test sensitivity verification.
          </p>
        </div>
        <Card className="p-12 text-center">
          <Dna className="w-12 h-12 text-muted/60 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-body">No mutation test runs available</h3>
          <p className="text-xs text-muted max-w-md mx-auto mt-1 mb-5">
            {activeProject
              ? `No audit runs have been executed for ${activeProject.name}. Click below to run mutation testing.`
              : 'Please select a project from the workspace to view mutation results.'}
          </p>
          {activeProject && (
            <div className="flex justify-center gap-3">
              <Button
                size="sm"
                variant="primary"
                leftIcon={<Play className="w-4 h-4 fill-current" />}
                onClick={() => handleTriggerRun(false)}
                isLoading={reRunning}
              >
                Run Mutation Analysis
              </Button>
            </div>
          )}
        </Card>
      </div>
    );
  }

  const { run, mutations } = runDetails;
  const metrics = run.summaryMetrics;
  const durationSec = ((run.executionSandbox?.durationMs || 0) / 1000).toFixed(1);

  const filteredMutants = mutations.filter((m) => {
    if (filterStatus === 'all') return true;
    return m.status === filterStatus;
  });

  const survivedCount = mutations.filter((m) => m.status === 'survived').length;
  const killedCount = mutations.filter((m) => m.status === 'killed').length;

  return (
    <div className="space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-body tracking-tight">Mutation Testing Results</h1>
            <Badge variant={run.isIncremental ? 'medium' : 'accent'}>
              {run.runModeLabel || (run.isIncremental ? 'Incremental run' : 'Full run')}
            </Badge>
          </div>
          <p className="text-xs text-muted">
            Executed in {durationSec}s on {new Date(run.createdAt).toLocaleString()}.
            {run.reusedMutantsCount ? ` (${run.reusedMutantsCount} unchanged mutants reused from cache)` : ''}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            size="sm"
            variant="secondary"
            leftIcon={<RotateCw className="w-3.5 h-3.5" />}
            onClick={() => handleTriggerRun(true)}
            isLoading={reRunning}
            title="Forces a fresh full mutation run across all files"
          >
            Force full run
          </Button>
          <Button
            size="sm"
            variant="primary"
            leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
            onClick={() => handleTriggerRun(false)}
            isLoading={reRunning}
            title="Runs incremental mutation on modified files"
          >
            Re-run analysis
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-critical/15 border border-critical/30 text-critical text-xs">
          {error}
        </div>
      )}

      {/* Sandbox Integrity Alert Banner */}
      {!run.dockerAvailable && (
        <div className="p-4 rounded-2xl bg-medium/10 border border-medium/20 text-xs text-body flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-medium shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-body">
              Process Sandbox Watchdog Active (Docker Daemon Not Present)
            </span>
            <p className="text-muted leading-relaxed">
              Docker is not available on this host environment. Execution was performed inside an isolated Node.js child process sandbox with clean process environment stripping, disabled network egress, and strict execution timeout watchdogs.
            </p>
          </div>
        </div>
      )}

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 text-xs font-mono">
        {/* Baseline Tests */}
        <Card className="p-4">
          <span className="text-muted block mb-1 uppercase font-semibold text-[10px]">BASELINE TESTS</span>
          <div className="flex items-center gap-1.5 font-bold text-base text-body">
            <CheckCircle2 className="w-4 h-4 text-low" />
            <span>{metrics?.passedExecution || 0} passed</span>
          </div>
          <span className="text-muted text-[10px] mt-0.5 block">
            {metrics?.failedExecution > 0 ? `${metrics.failedExecution} failed` : '0 test suite regressions'}
          </span>
        </Card>

        {/* Mutation Kill Rate */}
        <Card className="p-4">
          <span className="text-muted block mb-1 uppercase font-semibold text-[10px]">KILL RATE</span>
          <div className="font-bold text-base text-body">
            <span className={metrics?.mutationKillRate >= 70 ? 'text-low' : 'text-critical'}>
              {metrics?.mutationKillRate || 0}%
            </span>
          </div>
          <span className="text-muted text-[10px] mt-0.5 block">
            Sensitivity measure
          </span>
        </Card>

        {/* Killed Mutants */}
        <Card className="p-4">
          <span className="text-muted block mb-1 uppercase font-semibold text-[10px]">KILLED MUTANTS</span>
          <div className="font-bold text-base text-low">
            {metrics?.killedMutants || 0}
          </div>
          <span className="text-muted text-[10px] mt-0.5 block">
            Tests caught synthetic bug
          </span>
        </Card>

        {/* Survived Mutants */}
        <Card className="p-4">
          <span className="text-muted block mb-1 uppercase font-semibold text-[10px]">SURVIVED MUTANTS</span>
          <div className="font-bold text-base text-critical">
            {metrics?.survivedMutants || 0}
          </div>
          <span className="text-muted text-[10px] mt-0.5 block">
            Tests passed despite code mutation
          </span>
        </Card>

        {/* Run Mode & Cache */}
        <Card className="p-4">
          <span className="text-muted block mb-1 uppercase font-semibold text-[10px]">EXECUTION TIME</span>
          <div className="font-bold text-base text-body">
            {durationSec}s
          </div>
          <span className="text-muted text-[10px] mt-0.5 block">
            {run.isIncremental ? `Incremental (${run.changedFilesCount || 0} file changed)` : 'Full baseline run'}
          </span>
        </Card>
      </div>

      {/* Honesty Principle Notice Card */}
      <div className="p-4 rounded-2xl bg-surface border border-border shadow-elevation-sm">
        <div className="flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-accent shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <span className="font-semibold text-body">Scientific Honesty Principle:</span>
            <p className="text-muted leading-relaxed">
              A surviving mutant is measurable evidence of a possible test blind spot, not mathematical proof of a bug. High kill rates demonstrate test suite sensitivity to code modifications, but never guarantee complete correctness or absence of unspecified edge cases.
            </p>
          </div>
        </div>
      </div>

      {/* Mutants Table & Filter */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border mb-4 gap-3">
          <div className="flex items-center gap-2">
            <Dna className="w-4 h-4 text-accent" />
            <h3 className="text-sm font-bold text-body">Synthetic Mutants Matrix</h3>
            <span className="text-xs text-muted font-mono">({mutations.length} total)</span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-3.5 h-3.5 text-muted" />
            <span className="text-muted">Filter:</span>
            <div className="flex items-center bg-surface-soft p-0.5 rounded-xl border border-border">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition-colors ${
                  filterStatus === 'all' ? 'bg-surface font-semibold text-body shadow-sm' : 'text-muted hover:text-body'
                }`}
              >
                All ({mutations.length})
              </button>
              <button
                onClick={() => setFilterStatus('survived')}
                className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition-colors ${
                  filterStatus === 'survived' ? 'bg-critical/20 font-semibold text-critical shadow-sm' : 'text-muted hover:text-body'
                }`}
              >
                Survived ({survivedCount})
              </button>
              <button
                onClick={() => setFilterStatus('killed')}
                className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition-colors ${
                  filterStatus === 'killed' ? 'bg-low/20 font-semibold text-low shadow-sm' : 'text-muted hover:text-body'
                }`}
              >
                Killed ({killedCount})
              </button>
            </div>
          </div>
        </div>

        {filteredMutants.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted">
            No mutants match the selected filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-border text-[11px] text-muted uppercase">
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Location</th>
                  <th className="py-2.5 px-3">Mutated Code</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredMutants.map((m) => {
                  const isExpanded = expandedMutantId === m._id;
                  const isSurvived = m.status === 'survived';
                  return (
                    <React.Fragment key={m._id}>
                      <tr
                        className={`hover:bg-surface-soft/60 cursor-pointer transition-colors ${
                          isSurvived ? 'bg-critical/5' : ''
                        }`}
                        onClick={() => setExpandedMutantId(isExpanded ? null : m._id)}
                      >
                        <td className="py-3 px-3">
                          <Badge variant={m.status === 'killed' ? 'killed' : 'survived'} size="sm">
                            {m.status.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="py-3 px-3 text-body font-semibold">
                          {m.category}
                        </td>
                        <td className="py-3 px-3 text-muted">
                          <span className="text-body font-semibold">{m.filePath}</span>:{m.line}
                        </td>
                        <td className="py-3 px-3 font-mono text-[11px] max-w-md truncate">
                          <span className="text-critical line-through mr-2">{m.originalCodeSnippet}</span>
                          <span className="text-low font-bold">{m.mutatedCodeSnippet}</span>
                        </td>
                        <td className="py-3 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-2">
                            {isSurvived && (
                              <Button
                                size="sm"
                                variant="outline"
                                leftIcon={<Sparkles className="w-3.5 h-3.5 text-accent" />}
                                onClick={() => {
                                  alert(`AI Test Generation for mutant at ${m.filePath}:${m.line} will be executed in Step 2.`);
                                }}
                              >
                                Suggest test
                              </Button>
                            )}
                            <button
                              onClick={() => setExpandedMutantId(isExpanded ? null : m._id)}
                              className="p-1 rounded text-muted hover:text-body"
                            >
                              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Mutant Details & Unified Diff */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={5} className="p-4 bg-code-bg rounded-xl border-y border-border">
                            <div className="space-y-3 text-xs font-mono text-[#F7EFE7]">
                              <div className="flex items-center justify-between text-[11px] text-muted">
                                <span>{m.description}</span>
                                <span>Execution: {m.executionDurationMs || 0}ms</span>
                              </div>

                              <div className="p-3 bg-[#1e171b] rounded-lg border border-[#4F3F48]">
                                <div className="text-[10px] text-muted uppercase mb-1">UNIFIED DIFF:</div>
                                <div className="text-critical">- {m.originalCodeSnippet}</div>
                                <div className="text-low">+ {m.mutatedCodeSnippet}</div>
                              </div>

                              {m.killingTestName && (
                                <div className="text-[11px] text-low">
                                  <span className="font-semibold">Killing Test:</span> {m.killingTestName}
                                </div>
                              )}

                              {isSurvived && (
                                <div className="p-3 bg-critical/10 border border-critical/30 rounded-lg text-critical text-[11px]">
                                  ⚠️ <span className="font-semibold">Surviving Mutant Insight:</span> All {metrics?.passedExecution || 0} tests passed even though this expression was altered to <code className="bg-black/30 px-1 py-0.5 rounded">{m.mutatedCodeSnippet}</code>. This reveals that the existing tests do not assert this condition or boundary.
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
