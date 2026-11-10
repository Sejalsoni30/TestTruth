import React, { useState, useEffect } from 'react';
import {
  FolderGit2,
  Plus,
  Trash2,
  Upload,
  Play,
  RotateCw,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Dna,
  ShieldCheck,
  Cpu,
  Layers,
  ExternalLink,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext.js';
import { projectService } from '../services/projectService.js';
import { runService } from '../services/runService.js';
import { AnalysisRun, RunStatusResponse } from '../types/index.js';
import { Card } from '../components/common/Card.js';
import { Button } from '../components/common/Button.js';
import { Badge } from '../components/common/Badge.js';
import { Modal } from '../components/common/Modal.js';
import { useNavigate } from 'react-router-dom';

export const ProjectWorkspacePage: React.FC = () => {
  const { projects, activeProject, setActiveProject, refreshProjects, loading } = useProject();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [framework, setFramework] = useState<'jest' | 'vitest' | 'custom'>('jest');
  const [language, setLanguage] = useState<'javascript' | 'typescript'>('javascript');
  const [deleteConfirmInput, setDeleteConfirmInput] = useState('');

  // Upload states
  const [uploadFiles, setUploadFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Run execution states
  const [projectRuns, setProjectRuns] = useState<AnalysisRun[]>([]);
  const [activeRunId, setActiveRunId] = useState<string | null>(null);
  const [activeRunStatus, setActiveRunStatus] = useState<RunStatusResponse | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const navigate = useNavigate();

  // Load project runs when active project changes
  useEffect(() => {
    if (activeProject) {
      loadProjectRuns(activeProject._id);
    } else {
      setProjectRuns([]);
    }
  }, [activeProject]);

  // Polling for active run status
  useEffect(() => {
    let timer: any = null;
    if (activeRunId && isRunning) {
      timer = setInterval(async () => {
        try {
          const status = await runService.getRunStatus(activeRunId);
          setActiveRunStatus(status);

          if (status.status === 'completed' || status.status === 'failed') {
            setIsRunning(false);
            if (activeProject) {
              await loadProjectRuns(activeProject._id);
              await refreshProjects();
            }
          }
        } catch (err) {
          console.error('Failed to poll run status:', err);
        }
      }, 1500);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [activeRunId, isRunning, activeProject]);

  const loadProjectRuns = async (projectId: string) => {
    try {
      const runs = await runService.listProjectRuns(projectId);
      setProjectRuns(runs);
    } catch (err) {
      console.error('Failed to load project runs:', err);
    }
  };

  const handleStartRun = async (forceFullRun = false) => {
    if (!activeProject) return;
    setError(null);
    try {
      setIsRunning(true);
      const res = await runService.startAnalysisRun(activeProject._id, forceFullRun);
      setActiveRunId(res.runId);
      setActiveRunStatus({
        runId: res.runId,
        status: 'queued',
        progressStage: 'queued',
        progressMessage: forceFullRun ? 'Triggering forced full mutation analysis...' : 'Comparing source file hashes for incremental execution...',
        isIncremental: !forceFullRun,
        changedFilesCount: 0,
        reusedMutantsCount: 0,
        runModeLabel: forceFullRun ? 'Force full run' : 'Analyzing changes...',
        durationMs: 0,
        dockerAvailable: false,
      });
    } catch (err: any) {
      setIsRunning(false);
      setError(err.message || 'Failed to trigger analysis run');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await projectService.createProject({
        name,
        description,
        framework,
        language,
      });
      await refreshProjects();
      setActiveProject(res.project);
      setIsCreateOpen(false);
      setName('');
      setDescription('');
    } catch (err: any) {
      setError(err.message || 'Failed to create project');
    }
  };

  const handleDelete = async () => {
    if (!activeProject) return;
    setError(null);
    try {
      await projectService.deleteProject(activeProject._id, deleteConfirmInput);
      await refreshProjects();
      setIsDeleteOpen(false);
      setDeleteConfirmInput('');
    } catch (err: any) {
      setError(err.message || 'Failed to delete project');
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject || !uploadFiles || uploadFiles.length === 0) return;

    setUploading(true);
    setError(null);
    setUploadMessage(null);

    const formData = new FormData();
    for (let i = 0; i < uploadFiles.length; i++) {
      formData.append('files', uploadFiles[i]);
    }

    try {
      const res = await projectService.uploadFiles(activeProject._id, formData);
      setUploadMessage(res.message);
      await refreshProjects();
      setTimeout(() => {
        setIsUploadOpen(false);
        setUploadMessage(null);
        setUploadFiles(null);
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-body tracking-tight">Project Workspaces</h1>
          <p className="text-xs text-muted mt-1">
            Manage test suites, run incremental mutation audits, and verify test reliability with reproducible evidence.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="secondary"
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            onClick={() => {
              refreshProjects();
              if (activeProject) loadProjectRuns(activeProject._id);
            }}
            isLoading={loading}
          >
            Refresh
          </Button>
          <Button
            size="sm"
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsCreateOpen(true)}
          >
            New Project
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-critical/15 border border-critical/30 text-critical text-xs flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-critical hover:underline">Dismiss</button>
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map((project) => {
          const isSelected = activeProject?._id === project._id;
          return (
            <Card
              key={project._id}
              variant={isSelected ? 'interactive' : 'default'}
              className={`p-5 flex flex-col justify-between cursor-pointer ${
                isSelected ? 'border-accent shadow-elevation-md ring-2 ring-accent/30' : ''
              }`}
              onClick={() => setActiveProject(project)}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
                    <FolderGit2 className="w-5 h-5" />
                  </div>
                  <Badge variant="neutral" size="sm">
                    {project.language}
                  </Badge>
                </div>

                <h3 className="text-base font-bold text-body mb-1">{project.name}</h3>
                <p className="text-xs text-muted line-clamp-2 mb-4">
                  {project.description || 'No description provided.'}
                </p>

                <div className="grid grid-cols-3 gap-2 p-2.5 bg-bg/80 rounded-xl border border-border text-center font-mono text-[11px] mb-4">
                  <div>
                    <span className="text-muted block text-[9px] uppercase font-semibold">Files</span>
                    <span className="font-semibold text-body">{project.stats?.totalFiles || 0}</span>
                  </div>
                  <div>
                    <span className="text-muted block text-[9px] uppercase font-semibold">Tests</span>
                    <span className="font-semibold text-accent">{project.stats?.testFilesCount || 0}</span>
                  </div>
                  <div>
                    <span className="text-muted block text-[9px] uppercase font-semibold">Kill Rate</span>
                    <span className="font-semibold text-low">
                      {project.stats?.lastMutationKillRate !== undefined ? `${project.stats.lastMutationKillRate}%` : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between">
                <span className="text-[10px] font-mono text-muted uppercase">
                  {project.framework}
                </span>
                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => {
                      setActiveProject(project);
                      setIsUploadOpen(true);
                    }}
                    title="Upload code or ZIP"
                    className="p-1.5 rounded-full text-muted hover:text-body hover:bg-surface-soft transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setActiveProject(project);
                      setIsDeleteOpen(true);
                    }}
                    title="Delete project"
                    className="p-1.5 rounded-full text-muted hover:text-critical hover:bg-surface-soft transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Active Project Management & Run Actions Panel */}
      {activeProject ? (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-border mb-6 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-lg font-bold text-body">{activeProject.name}</h2>
                  <Badge variant="accent">{activeProject.framework.toUpperCase()}</Badge>
                  <Badge variant="neutral">{activeProject.language.toUpperCase()}</Badge>
                </div>
                <p className="text-xs text-muted">{activeProject.description || 'Workspace ready for test suite inspection.'}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<Upload className="w-3.5 h-3.5" />}
                  onClick={() => setIsUploadOpen(true)}
                  disabled={isRunning}
                >
                  Upload ZIP
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  leftIcon={<RotateCw className="w-3.5 h-3.5" />}
                  onClick={() => handleStartRun(true)}
                  isLoading={isRunning}
                  title="Re-executes all mutants from scratch regardless of file hashes"
                >
                  Force Full Run
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
                  onClick={() => handleStartRun(false)}
                  isLoading={isRunning}
                >
                  Run Analysis
                </Button>
              </div>
            </div>

            {/* Live Progress Stage Notification */}
            {activeRunStatus && (
              <div className={`mb-6 p-4 rounded-2xl border transition-all ${
                activeRunStatus.status === 'completed'
                  ? 'bg-low/10 border-low/30'
                  : activeRunStatus.status === 'failed'
                  ? 'bg-critical/10 border-critical/30'
                  : 'bg-accent/10 border-accent/30'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    {activeRunStatus.status === 'running' || activeRunStatus.status === 'queued' ? (
                      <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                    ) : activeRunStatus.status === 'completed' ? (
                      <CheckCircle2 className="w-5 h-5 text-low" />
                    ) : (
                      <XCircle className="w-5 h-5 text-critical" />
                    )}
                    <span className="font-semibold text-xs text-body uppercase tracking-wide font-mono">
                      Stage: {activeRunStatus.progressStage}
                    </span>
                    <Badge variant={activeRunStatus.isIncremental ? 'medium' : 'accent'} size="sm">
                      {activeRunStatus.runModeLabel}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {activeRunStatus.status === 'completed' && (
                      <Button
                        size="sm"
                        variant="primary"
                        leftIcon={<ExternalLink className="w-3.5 h-3.5" />}
                        onClick={() => navigate(`/mutation-results?runId=${activeRunStatus.runId}`)}
                      >
                        View Results
                      </Button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-muted mb-2 font-mono">
                  {activeRunStatus.progressMessage}
                </p>

                {/* Honest Docker availability notice */}
                {!activeRunStatus.dockerAvailable && (
                  <div className="mt-2 text-[11px] text-medium flex items-center gap-1.5 bg-medium/10 p-2 rounded-lg border border-medium/20">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      Docker daemon is not available on host. Executing inside isolated process sandbox with sanitized environment and timeout watchdog.
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Project Telemetry Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
              <div className="p-4 bg-bg/80 rounded-xl border border-border">
                <span className="text-muted block mb-1 font-semibold uppercase text-[10px]">TOTAL FILES</span>
                <span className="text-body font-semibold">{activeProject.stats?.totalFiles || 0}</span>
                <span className="text-muted block text-[10px] mt-0.5 font-normal">
                  ({activeProject.stats?.sourceFilesCount || 0} src, {activeProject.stats?.testFilesCount || 0} test)
                </span>
              </div>
              <div className="p-4 bg-bg/80 rounded-xl border border-border">
                <span className="text-muted block mb-1 font-semibold uppercase text-[10px]">MUTATION KILL RATE</span>
                <span className="text-body font-semibold text-low">
                  {activeProject.stats?.lastMutationKillRate !== undefined
                    ? `${activeProject.stats.lastMutationKillRate}%`
                    : 'N/A'}
                </span>
                <span className="text-muted block text-[10px] mt-0.5 font-normal">Sensitivity score</span>
              </div>
              <div className="p-4 bg-bg/80 rounded-xl border border-border">
                <span className="text-muted block mb-1 font-semibold uppercase text-[10px]">RELIABILITY FINDINGS</span>
                <span className="text-body font-semibold text-critical">
                  {activeProject.stats?.lastFindingsCount || 0}
                </span>
                <span className="text-muted block text-[10px] mt-0.5 font-normal">Weak spots flagged</span>
              </div>
              <div className="p-4 bg-bg/80 rounded-xl border border-border">
                <span className="text-muted block mb-1 font-semibold uppercase text-[10px]">LAST RUN</span>
                <span className="text-body font-semibold">
                  {activeProject.stats?.lastRunAt
                    ? new Date(activeProject.stats.lastRunAt).toLocaleTimeString()
                    : 'Never'}
                </span>
                <span className="text-muted block text-[10px] mt-0.5 font-normal">
                  {activeProject.stats?.lastRunAt
                    ? new Date(activeProject.stats.lastRunAt).toLocaleDateString()
                    : 'Awaiting execution'}
                </span>
              </div>
            </div>
          </Card>

          {/* Audit Run History Table */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-accent" />
                <h3 className="text-sm font-bold text-body">Audit Run History</h3>
              </div>
              <span className="text-xs text-muted font-mono">{projectRuns.length} total runs</span>
            </div>

            {projectRuns.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted">
                <p>No audit runs completed yet for this project.</p>
                <p className="mt-1">Click "Run Analysis" or upload a ZIP archive above to trigger the mutation pipeline.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-border text-[11px] text-muted uppercase">
                      <th className="py-2.5 px-3">Run Mode</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Duration</th>
                      <th className="py-2.5 px-3">Baseline Tests</th>
                      <th className="py-2.5 px-3">Mutants</th>
                      <th className="py-2.5 px-3">Kill Rate</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {projectRuns.map((r) => {
                      const durationSec = ((r.executionSandbox?.durationMs || 0) / 1000).toFixed(1);
                      return (
                        <tr key={r._id} className="hover:bg-surface-soft/60 transition-colors">
                          <td className="py-3 px-3">
                            <div className="font-semibold text-body">
                              {r.runModeLabel || (r.isIncremental ? 'Incremental run' : 'Full run')}
                            </div>
                            <div className="text-[10px] text-muted">
                              {new Date(r.createdAt).toLocaleString()}
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <Badge
                              variant={r.status === 'completed' ? 'low' : r.status === 'failed' ? 'critical' : 'accent'}
                              size="sm"
                            >
                              {r.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-3 text-body">{durationSec}s</td>
                          <td className="py-3 px-3">
                            <span className="text-low font-semibold">{r.summaryMetrics?.passedExecution || 0} passed</span>
                            {r.summaryMetrics?.failedExecution > 0 && (
                              <span className="text-critical ml-1.5 font-semibold">
                                ({r.summaryMetrics.failedExecution} failed)
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3">
                            <span className="text-low font-semibold">{r.summaryMetrics?.killedMutants || 0} killed</span>
                            <span className="text-muted mx-1">/</span>
                            <span className="text-critical font-semibold">{r.summaryMetrics?.survivedMutants || 0} survived</span>
                            {Boolean(r.reusedMutantsCount && r.reusedMutantsCount > 0) && (
                              <div className="text-[10px] text-muted">
                                ({r.reusedMutantsCount} cached)
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-bold text-body">
                              {r.summaryMetrics?.mutationKillRate || 0}%
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigate(`/mutation-results?runId=${r._id}`)}
                            >
                              View Details
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      ) : (
        <Card className="p-12 text-center">
          <FolderGit2 className="w-12 h-12 text-muted/60 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-body">No projects created yet</h3>
          <p className="text-xs text-muted max-w-sm mx-auto mt-1 mb-5 leading-relaxed">
            Create a project and upload your JavaScript/TypeScript files or ZIP archive to begin reliability verification.
          </p>
          <Button size="md" variant="primary" onClick={() => setIsCreateOpen(true)}>
            Create Project Now
          </Button>
        </Card>
      )}

      {/* Create Project Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create New Project">
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-critical/15 border border-critical/30 text-critical">
              {error}
            </div>
          )}
          <div>
            <label className="block font-semibold text-body mb-1">Project Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Core Authentication Service"
              className="w-full bg-surface-soft border border-border rounded-xl px-3.5 py-2.5 text-body focus:outline-none focus:border-accent shadow-elevation-sm"
            />
          </div>
          <div>
            <label className="block font-semibold text-body mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of application scope..."
              className="w-full bg-surface-soft border border-border rounded-xl px-3.5 py-2.5 text-body focus:outline-none focus:border-accent shadow-elevation-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-body mb-1">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="w-full bg-surface-soft border border-border rounded-xl px-3 py-2 text-body focus:outline-none focus:border-accent shadow-elevation-sm"
              >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-body mb-1">Test Framework</label>
              <select
                value={framework}
                onChange={(e) => setFramework(e.target.value as any)}
                className="w-full bg-surface-soft border border-border rounded-xl px-3 py-2 text-body focus:outline-none focus:border-accent shadow-elevation-sm"
              >
                <option value="jest">Jest</option>
                <option value="vitest">Vitest</option>
                <option value="custom">Custom Runner</option>
              </select>
            </div>
          </div>
          <div className="pt-4 border-t border-border flex justify-end gap-2">
            <Button size="sm" variant="ghost" type="button" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" variant="primary" type="submit">
              Create Project
            </Button>
          </div>
        </form>
      </Modal>

      {/* Upload Files Modal */}
      <Modal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        title={`Upload Code / ZIP to ${activeProject?.name}`}
      >
        <form onSubmit={handleUpload} className="space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-critical/15 border border-critical/30 text-critical">
              {error}
            </div>
          )}
          {uploadMessage && (
            <div className="p-3 rounded-xl bg-low/15 border border-low/30 text-low flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{uploadMessage}</span>
            </div>
          )}

          <div className="border-2 border-dashed border-border hover:border-accent/60 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-bg/50">
            <input
              type="file"
              id="file-upload"
              multiple
              accept=".zip,.js,.ts,.jsx,.tsx,.json"
              onChange={(e) => setUploadFiles(e.target.files)}
              className="hidden"
            />
            <label htmlFor="file-upload" className="cursor-pointer block">
              <Upload className="w-8 h-8 text-accent mx-auto mb-2" />
              <p className="font-semibold text-body">Click to select files or a ZIP archive</p>
              <p className="text-[11px] text-muted mt-1">
                Supports .zip, .js, .ts files (with zip-slip safety protection & SHA-256 incremental hashing)
              </p>
            </label>
          </div>

          {uploadFiles && uploadFiles.length > 0 && (
            <div className="p-3 bg-surface-soft rounded-xl border border-border">
              <span className="font-semibold text-body block mb-1">Selected: {uploadFiles.length} file(s)</span>
              <ul className="text-muted font-mono text-[11px] max-h-24 overflow-y-auto space-y-0.5">
                {Array.from(uploadFiles).map((f, i) => (
                  <li key={i}>• {f.name} ({(f.size / 1024).toFixed(1)} KB)</li>
                ))}
              </ul>
            </div>
          )}

          <div className="pt-4 border-t border-border flex justify-end gap-2">
            <Button size="sm" variant="ghost" type="button" onClick={() => setIsUploadOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              variant="primary"
              type="submit"
              isLoading={uploading}
              disabled={!uploadFiles || uploadFiles.length === 0}
            >
              Upload & Extract
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Project Confirmation Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete Project Workspace"
      >
        <div className="space-y-4 text-xs">
          <p className="text-body leading-relaxed">
            This action is permanent and will delete all files, analysis runs, findings, and mutation test history for:
          </p>
          <div className="p-3 bg-surface-soft rounded-xl font-mono text-body font-semibold border border-border">
            {activeProject?.name}
          </div>
          <div>
            <label className="block text-muted mb-1">
              Please type <span className="font-semibold text-body">"{activeProject?.name}"</span> to confirm:
            </label>
            <input
              type="text"
              value={deleteConfirmInput}
              onChange={(e) => setDeleteConfirmInput(e.target.value)}
              placeholder="Confirm project name"
              className="w-full bg-surface-soft border border-border rounded-xl px-3.5 py-2.5 text-body focus:outline-none focus:border-critical"
            />
          </div>
          <div className="pt-4 border-t border-border flex justify-end gap-2">
            <Button size="sm" variant="ghost" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              variant="danger"
              disabled={deleteConfirmInput !== activeProject?.name}
              onClick={handleDelete}
            >
              Delete Permanently
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
