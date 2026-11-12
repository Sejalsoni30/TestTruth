import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FolderGit2,
  CheckCircle2,
  XCircle,
  Dna,
  ShieldAlert,
  Sparkles,
  HelpCircle,
  Plus,
  ArrowRight,
  TrendingUp,
  Activity,
  Layers,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { runService } from '../services/runService.js';
import { DashboardMetrics } from '../types/index.js';
import { Card } from '../components/common/Card.js';
import { Button } from '../components/common/Button.js';
import { Badge } from '../components/common/Badge.js';
import { Modal } from '../components/common/Modal.js';
import { useProject } from '../context/ProjectContext.js';
import { motion } from 'framer-motion';
import { AnimatedCounter } from '../components/motion/AnimatedCounter.js';

export const DashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFormulaModal, setShowFormulaModal] = useState(false);
  const { projects } = useProject();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const data = await runService.getDashboardMetrics();
        setMetrics(data);
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-mono text-muted">Loading audit telemetry...</p>
        </div>
      </div>
    );
  }

  const m = metrics?.metrics || {
    totalProjects: projects.length,
    testsAnalysed: 0,
    passedExecution: 0,
    failedExecution: 0,
    survivingMutations: 0,
    killedMutants: 0,
    totalMutants: 0,
    killRate: 0,
    weakAssertions: 0,
    missingScenarios: 0,
  };

  // Severity Distribution: critical #B3261E | high #C75B12 | medium #B8860B | low #4F7A5C | info #3F6C9E
  const severityData = [
    { name: 'Critical', value: metrics?.severityCounts.critical || 0, color: '#B3261E' },
    { name: 'High', value: metrics?.severityCounts.high || 0, color: '#C75B12' },
    { name: 'Medium', value: metrics?.severityCounts.medium || 0, color: '#B8860B' },
    { name: 'Low', value: metrics?.severityCounts.low || 0, color: '#4F7A5C' },
    { name: 'Info', value: metrics?.severityCounts.info || 0, color: '#3F6C9E' },
  ];

  // Mutation outcomes: killed #4F7A5C | survived #B3261E
  const mutationOutcomeData = [
    { name: 'Killed', value: m.killedMutants, color: '#4F7A5C' },
    { name: 'Survived', value: m.survivingMutations, color: '#B3261E' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-body tracking-tight">Test Quality & Reliability Telemetry</h1>
          <p className="text-xs text-muted mt-1">
            Empirical evidence across test suites. No blended vanity scores.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="outline"
            leftIcon={<HelpCircle className="w-3.5 h-3.5 text-muted" />}
            onClick={() => setShowFormulaModal(true)}
          >
            Formula & Limits Disclosure
          </Button>
          <Button
            size="sm"
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => navigate('/projects')}
          >
            New Project
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid (Interactive Motion Cards with Animated Counters) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.15 }}>
          <Card className="p-4 h-full">
            <div className="flex items-center justify-between text-muted mb-2">
              <span className="text-[11px] font-mono uppercase font-semibold">Projects</span>
              <FolderGit2 className="w-4 h-4 text-accent" />
            </div>
            <div className="text-2xl font-bold text-body">
              <AnimatedCounter value={m.totalProjects} />
            </div>
            <div className="text-[10px] text-muted mt-1 font-medium">Active workspaces</div>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.15 }}>
          <Card className="p-4 h-full">
            <div className="flex items-center justify-between text-muted mb-2">
              <span className="text-[11px] font-mono uppercase font-semibold">Tests Audited</span>
              <Activity className="w-4 h-4 text-accent" />
            </div>
            <div className="text-2xl font-bold text-body">
              <AnimatedCounter value={m.testsAnalysed} />
            </div>
            <div className="text-[10px] text-low mt-1 font-medium">
              {m.passedExecution} pass / {m.failedExecution} fail
            </div>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.15 }}>
          <Card className="p-4 h-full">
            <div className="flex items-center justify-between text-muted mb-2">
              <span className="text-[11px] font-mono uppercase font-semibold">Surviving Mutants</span>
              <Dna className="w-4 h-4 text-critical" />
            </div>
            <div className="text-2xl font-bold text-critical">
              <AnimatedCounter value={m.survivingMutations} />
            </div>
            <div className="text-[10px] text-muted mt-1">{m.totalMutants} mutants injected</div>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.15 }}>
          <Card className="p-4 h-full">
            <div className="flex items-center justify-between text-muted mb-2">
              <span className="text-[11px] font-mono uppercase font-semibold">Kill Rate</span>
              <TrendingUp className="w-4 h-4 text-low" />
            </div>
            <div className="text-2xl font-bold text-low">
              <AnimatedCounter value={m.killRate} decimals={1} suffix="%" />
            </div>
            <div
              className="text-[10px] text-muted mt-1 cursor-pointer hover:underline hover:text-body"
              onClick={() => setShowFormulaModal(true)}
            >
              View formula & limits
            </div>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.15 }}>
          <Card className="p-4 h-full">
            <div className="flex items-center justify-between text-muted mb-2">
              <span className="text-[11px] font-mono uppercase font-semibold">Weak Assertions</span>
              <ShieldAlert className="w-4 h-4 text-medium" />
            </div>
            <div className="text-2xl font-bold text-medium">
              <AnimatedCounter value={m.weakAssertions} />
            </div>
            <div className="text-[10px] text-muted mt-1">Run-only or truthy only</div>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.15 }}>
          <Card className="p-4 h-full">
            <div className="flex items-center justify-between text-muted mb-2">
              <span className="text-[11px] font-mono uppercase font-semibold">Missing Scenarios</span>
              <Sparkles className="w-4 h-4 text-high" />
            </div>
            <div className="text-2xl font-bold text-high">
              <AnimatedCounter value={m.missingScenarios} />
            </div>
            <div className="text-[10px] text-muted mt-1">Unchecked branches/edges</div>
          </Card>
        </motion.div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Severity Distribution */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-body">Findings by Severity</h3>
              <p className="text-[11px] text-muted">Classified by defect escape probability</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={severityData}>
                <XAxis dataKey="name" stroke="#6B5560" fontSize={11} />
                <YAxis stroke="#6B5560" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E6D2C4',
                    borderRadius: '12px',
                    color: '#3E3239',
                    boxShadow: '0 4px 12px rgba(62,50,57,0.1)',
                  }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Mutation Kill vs Survived */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-body">Mutation Outcomes</h3>
              <p className="text-[11px] text-muted">Sensitivity of tests to synthetic code modifications</p>
            </div>
            <Badge variant={m.killRate >= 70 ? 'killed' : 'survived'}>{m.killRate}% Killed</Badge>
          </div>
          <div className="h-64 flex items-center justify-center">
            {m.totalMutants === 0 ? (
              <div className="text-center text-xs text-muted font-mono">
                No mutation tests executed yet.
                <br />
                Run an audit on a project to generate mutants.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mutationOutcomeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {mutationOutcomeData.map((entry, index) => (
                      <Cell key={`mut-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#E6D2C4',
                      borderRadius: '12px',
                      color: '#3E3239',
                      boxShadow: '0 4px 12px rgba(62,50,57,0.1)',
                    }}
                    itemStyle={{ fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
          <div>
            <h3 className="text-sm font-semibold text-body">Recent Audit Runs</h3>
            <p className="text-[11px] text-muted">Execution history with reproducible timestamps</p>
          </div>
          <Link to="/projects" className="text-xs text-accent hover:text-accent-hover font-semibold inline-flex items-center gap-1">
            View All Projects <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {metrics?.recentRuns && metrics.recentRuns.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-muted font-mono uppercase text-[10px]">
                  <th className="pb-3">Project</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Tests</th>
                  <th className="pb-3">Mutation Kill Rate</th>
                  <th className="pb-3">Weak Assertions</th>
                  <th className="pb-3">Executed At</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 font-mono">
                {metrics.recentRuns.map((run) => (
                  <tr key={run._id} className="hover:bg-surface-soft/60 transition-colors">
                    <td className="py-3 font-sans font-medium text-body">
                      {(run.projectId as any)?.name || 'Project'}
                    </td>
                    <td className="py-3">
                      <Badge variant={run.status === 'completed' ? 'killed' : run.status === 'failed' ? 'critical' : 'neutral'}>
                        {run.status}
                      </Badge>
                    </td>
                    <td className="py-3 text-muted">
                      {run.summaryMetrics?.totalTests || 0}
                    </td>
                    <td className="py-3 text-low font-bold">
                      {run.summaryMetrics?.mutationKillRate || 0}%
                    </td>
                    <td className="py-3 text-medium">
                      {run.summaryMetrics?.weakAssertionsCount || 0}
                    </td>
                    <td className="py-3 text-muted text-[11px]">
                      {new Date(run.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 text-right font-sans">
                      <Link
                        to={`/reliability-analysis?runId=${run._id}`}
                        className="text-xs text-accent hover:text-accent-hover font-medium hover:underline"
                      >
                        Inspect Findings
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center">
            <Layers className="w-10 h-10 text-muted/60 mx-auto mb-3" />
            <h4 className="text-sm font-semibold text-body">No audit runs recorded yet</h4>
            <p className="text-xs text-muted max-w-sm mx-auto mt-1 mb-5 leading-relaxed">
              Upload a JavaScript or TypeScript codebase to execute AST reliability checks, isolated mutation testing, and AI scenario generation.
            </p>
            <Button size="sm" variant="primary" onClick={() => navigate('/projects')}>
              Create Your First Project
            </Button>
          </div>
        )}
      </Card>

      {/* Formula & Limits Disclosure Modal */}
      <Modal
        isOpen={showFormulaModal}
        onClose={() => setShowFormulaModal(false)}
        title="Formula & Inherent Limitations Disclosure"
        maxWidth="lg"
      >
        <div className="space-y-4 text-xs">
          <div className="p-3.5 bg-surface-soft border border-border rounded-xl">
            <div className="font-mono font-semibold text-body mb-1">
              Metric: {metrics?.formulaDocumentation.metric || 'Mutation Kill Rate (%)'}
            </div>
            <div className="font-mono text-accent bg-surface p-2.5 rounded-lg border border-border">
              Formula: {metrics?.formulaDocumentation.formula || '(Killed Mutants / Total Mutants) * 100'}
            </div>
            <p className="text-muted mt-2 leading-relaxed">
              {metrics?.formulaDocumentation.description ||
                'Measures the fraction of synthetically introduced code defects that caused at least one test to fail.'}
            </p>
          </div>

          <div>
            <h5 className="font-semibold text-body mb-2 uppercase tracking-wider text-[11px] font-mono">
              Non-Negotiable Limitations (Hard Truths):
            </h5>
            <ul className="space-y-2 text-muted list-disc pl-4 leading-relaxed">
              {metrics?.formulaDocumentation.inherentLimitations.map((lim, idx) => (
                <li key={idx}>{lim}</li>
              ))}
            </ul>
          </div>

          <div className="pt-3 border-t border-border flex justify-end">
            <Button size="sm" variant="secondary" onClick={() => setShowFormulaModal(false)}>
              Understood
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
