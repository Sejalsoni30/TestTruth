import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProject } from '../context/ProjectContext.js';
import { runService, RunDetailsResponse } from '../services/runService.js';
import { Card } from '../components/common/Card.js';
import { Button } from '../components/common/Button.js';
import { Badge } from '../components/common/Badge.js';
import {
  ShieldAlert,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Filter,
  FileCode,
  Sparkles,
  Layers,
  Code2,
} from 'lucide-react';

export const ReliabilityAnalysisPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const runIdParam = searchParams.get('runId');
  const { activeProject } = useProject();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [runDetails, setRunDetails] = useState<RunDetailsResponse | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterClassification, setFilterClassification] = useState<string>('all');
  const [expandedFindingId, setExpandedFindingId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [runIdParam, activeProject]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      let targetRunId = runIdParam;

      if (!targetRunId && activeProject) {
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
      setError(err.message || 'Failed to load reliability findings');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 space-y-4">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-muted font-mono">Auditing AST assertion patterns...</p>
      </div>
    );
  }

  if (!runDetails || !runDetails.run) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-body tracking-tight">Test Reliability Findings</h1>
          <p className="text-xs text-muted mt-1">
            Evidence-backed detection of weak assertions, run-only tests, and unverified exception paths.
          </p>
        </div>
        <Card className="p-12 text-center">
          <ShieldAlert className="w-12 h-12 text-muted/60 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-body">No audit findings recorded</h3>
          <p className="text-xs text-muted max-w-md mx-auto mt-1 mb-5">
            {activeProject
              ? `Execute a reliability run on ${activeProject.name} to detect shallow assertions and untested boundaries.`
              : 'Select a project from the workspace to view findings.'}
          </p>
        </Card>
      </div>
    );
  }

  const { run, findings } = runDetails;

  const filteredFindings = findings.filter((f) => {
    if (filterSeverity !== 'all' && f.severity !== filterSeverity) return false;
    if (filterClassification !== 'all' && f.classification !== filterClassification) return false;
    return true;
  });

  const criticalCount = findings.filter((f) => f.severity === 'critical').length;
  const highCount = findings.filter((f) => f.severity === 'high').length;
  const mediumCount = findings.filter((f) => f.severity === 'medium').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-body tracking-tight">Test Reliability Findings</h1>
            <Badge variant="accent">{findings.length} findings</Badge>
          </div>
          <p className="text-xs text-muted">
            AST analysis on {run.projectId ? (run.projectId as any).name || 'project' : 'suite'} • Run mode: {run.runModeLabel || 'Full audit'}
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-critical/15 border border-critical/30 text-critical text-xs">
          {error}
        </div>
      )}

      {/* Findings Breakdown Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
        <Card className="p-4">
          <span className="text-muted block mb-1 uppercase font-semibold text-[10px]">TOTAL FINDINGS</span>
          <div className="font-bold text-base text-body">{findings.length}</div>
          <span className="text-muted text-[10px] mt-0.5 block">Identified by static AST rules</span>
        </Card>

        <Card className="p-4">
          <span className="text-muted block mb-1 uppercase font-semibold text-[10px]">CRITICAL SEVERITY</span>
          <div className="font-bold text-base text-critical">{criticalCount}</div>
          <span className="text-muted text-[10px] mt-0.5 block">Zero-assertion or tautological tests</span>
        </Card>

        <Card className="p-4">
          <span className="text-muted block mb-1 uppercase font-semibold text-[10px]">HIGH SEVERITY</span>
          <div className="font-bold text-base text-high">{highCount}</div>
          <span className="text-muted text-[10px] mt-0.5 block">Shallow truthiness checks</span>
        </Card>

        <Card className="p-4">
          <span className="text-muted block mb-1 uppercase font-semibold text-[10px]">MEDIUM SEVERITY</span>
          <div className="font-bold text-base text-medium">{mediumCount}</div>
          <span className="text-muted text-[10px] mt-0.5 block">Missing exception handling</span>
        </Card>
      </div>

      {/* Filter Toolbar */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted font-semibold">Severity:</span>
            {['all', 'critical', 'high', 'medium', 'low'].map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-3 py-1 rounded-lg font-mono text-[11px] capitalize transition-colors ${
                  filterSeverity === sev
                    ? 'bg-accent text-accent-text font-semibold shadow-sm'
                    : 'bg-surface-soft text-muted hover:text-body'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-muted font-semibold">Classification:</span>
            <select
              value={filterClassification}
              onChange={(e) => setFilterClassification(e.target.value)}
              className="bg-surface-soft border border-border rounded-xl px-3 py-1.5 text-xs text-body focus:outline-none focus:border-accent"
            >
              <option value="all">All Classifications</option>
              <option value="Weak assertion">Weak assertion</option>
              <option value="Missing scenario">Missing scenario</option>
              <option value="Surviving mutation">Surviving mutation</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Findings List */}
      <div className="space-y-4">
        {filteredFindings.length === 0 ? (
          <Card className="p-8 text-center text-xs text-muted">
            No findings match your current filter criteria.
          </Card>
        ) : (
          filteredFindings.map((f) => {
            const isExpanded = expandedFindingId === f._id;
            return (
              <Card
                key={f._id}
                className={`p-5 transition-all cursor-pointer ${
                  f.severity === 'critical'
                    ? 'border-l-4 border-l-critical'
                    : f.severity === 'high'
                    ? 'border-l-4 border-l-high'
                    : 'border-l-4 border-l-medium'
                }`}
                onClick={() => setExpandedFindingId(isExpanded ? null : f._id)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <Badge variant={f.severity}>{f.severity.toUpperCase()}</Badge>
                      <Badge variant="weak">{f.classification}</Badge>
                      <span className="text-xs font-mono text-muted bg-surface-soft px-2 py-0.5 rounded-md border border-border">
                        {f.ruleId}
                      </span>
                      <span className="text-xs font-mono text-muted">
                        Confidence: <strong className="text-body font-semibold">{f.confidence.toUpperCase()} ({f.confidenceScore}%)</strong>
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-body">{f.title}</h3>
                    <p className="text-xs text-muted font-mono mt-0.5">
                      {f.filePath}:{f.line}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setExpandedFindingId(isExpanded ? null : f._id)}
                      className="p-1.5 rounded-full text-muted hover:text-body hover:bg-surface-soft"
                    >
                      {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <p className="text-xs text-body mt-3 leading-relaxed">
                  {f.whyUnreliable}
                </p>

                {/* Expanded Finding Evidence & Suggested Fix */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-border space-y-4 text-xs font-mono">
                    {f.evidence?.actualAssertion && (
                      <div>
                        <span className="text-[10px] text-muted uppercase font-semibold block mb-1">EVIDENCE (AST DETECTED EXPRESSION):</span>
                        <div className="p-3 bg-code-bg text-[#F7EFE7] rounded-xl border border-border font-mono text-[11px] overflow-x-auto">
                          <code>{f.evidence.actualAssertion}</code>
                        </div>
                      </div>
                    )}

                    <div>
                      <span className="text-[10px] text-accent uppercase font-semibold block mb-1">SUGGESTED DEFENSIVE FIX:</span>
                      <div className="p-3 bg-surface-soft text-body rounded-xl border border-accent/30 font-mono text-[11px] whitespace-pre-wrap">
                        {f.suggestedFix}
                      </div>
                    </div>

                    <div className="text-[11px] text-muted">
                      Rule explanation: Tests flagged with <code className="text-accent">{f.ruleId}</code> do not verify true state invariants or behavior. Replace with rigorous boundary and value assertions.
                    </div>
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};
