import React, { useState } from 'react';
import {
  FolderGit2,
  Plus,
  Trash2,
  Upload,
  FileCode,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Play,
  FileArchive,
  RefreshCw,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext.js';
import { projectService } from '../services/projectService.js';
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

  const navigate = useNavigate();

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
          <h1 className="text-2xl font-bold text-white tracking-tight">Project Workspaces</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage codebases, upload test suites, and trigger deep reliability audits.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="secondary"
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            onClick={() => refreshProjects()}
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

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map((project) => {
          const isSelected = activeProject?._id === project._id;
          return (
            <Card
              key={project._id}
              variant={isSelected ? 'interactive' : 'default'}
              className={`p-5 flex flex-col justify-between ${
                isSelected ? 'border-indigo-500 shadow-indigo-500/10 shadow-lg' : ''
              }`}
              onClick={() => setActiveProject(project)}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <FolderGit2 className="w-5 h-5" />
                  </div>
                  <Badge variant={project.language === 'typescript' ? 'cyan' : 'indigo'} size="sm">
                    {project.language}
                  </Badge>
                </div>

                <h3 className="text-base font-bold text-white mb-1">{project.name}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 mb-4">
                  {project.description || 'No description provided.'}
                </p>

                <div className="grid grid-cols-3 gap-2 p-2.5 bg-[#0B0F19] rounded-lg border border-slate-800 text-center font-mono text-[11px] mb-4">
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase">Files</span>
                    <span className="font-semibold text-slate-200">{project.stats?.totalFiles || 0}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase">Tests</span>
                    <span className="font-semibold text-cyan-400">{project.stats?.testFilesCount || 0}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase">Kill Rate</span>
                    <span className="font-semibold text-emerald-400">
                      {project.stats?.lastMutationKillRate ? `${project.stats.lastMutationKillRate}%` : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500">
                  {project.framework.toUpperCase()}
                </span>
                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => {
                      setActiveProject(project);
                      setIsUploadOpen(true);
                    }}
                    title="Upload code or ZIP"
                    className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    <Upload className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setActiveProject(project);
                      setIsDeleteOpen(true);
                    }}
                    title="Delete project"
                    className="p-1.5 rounded text-slate-400 hover:text-red-400 hover:bg-slate-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Active Project Management Details Panel */}
      {activeProject ? (
        <Card className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-slate-800 mb-6 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-bold text-white">{activeProject.name}</h2>
                <Badge variant="indigo">{activeProject.framework}</Badge>
              </div>
              <p className="text-xs text-slate-400">{activeProject.description || 'Workspace ready for test suite inspection.'}</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                variant="outline"
                leftIcon={<Upload className="w-3.5 h-3.5" />}
                onClick={() => setIsUploadOpen(true)}
              >
                Upload Code / ZIP
              </Button>
              <Button
                size="sm"
                variant="primary"
                leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
                onClick={() => navigate('/source-analysis')}
              >
                Inspect Source & Run Audit
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-4 bg-[#0B0F19] rounded-lg border border-slate-800">
              <span className="text-slate-400 block mb-1">PROJECT ID</span>
              <span className="text-slate-200">{activeProject._id}</span>
            </div>
            <div className="p-4 bg-[#0B0F19] rounded-lg border border-slate-800">
              <span className="text-slate-400 block mb-1">CREATED AT</span>
              <span className="text-slate-200">{new Date(activeProject.createdAt).toLocaleString()}</span>
            </div>
            <div className="p-4 bg-[#0B0F19] rounded-lg border border-slate-800">
              <span className="text-slate-400 block mb-1">LAST AUDIT EXECUTION</span>
              <span className="text-slate-200">
                {activeProject.stats?.lastRunAt
                  ? new Date(activeProject.stats.lastRunAt).toLocaleString()
                  : 'Never executed'}
              </span>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-12 text-center">
          <FolderGit2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No projects created yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-5">
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
            <div className="p-2.5 rounded bg-red-500/10 border border-red-500/20 text-red-400">
              {error}
            </div>
          )}
          <div>
            <label className="block font-medium text-slate-300 mb-1">Project Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Core Authentication Service"
              className="w-full bg-[#0B0F19] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block font-medium text-slate-300 mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of application scope..."
              className="w-full bg-[#0B0F19] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="w-full bg-[#0B0F19] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-slate-300 mb-1">Test Framework</label>
              <select
                value={framework}
                onChange={(e) => setFramework(e.target.value as any)}
                className="w-full bg-[#0B0F19] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="jest">Jest</option>
                <option value="vitest">Vitest</option>
                <option value="custom">Custom Runner</option>
              </select>
            </div>
          </div>
          <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
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
        title={`Upload Code to ${activeProject?.name}`}
      >
        <form onSubmit={handleUpload} className="space-y-4 text-xs">
          {error && (
            <div className="p-2.5 rounded bg-red-500/10 border border-red-500/20 text-red-400">
              {error}
            </div>
          )}
          {uploadMessage && (
            <div className="p-2.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{uploadMessage}</span>
            </div>
          )}

          <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 text-center hover:border-indigo-500/60 transition-colors bg-[#0B0F19]/50">
            <FileArchive className="w-10 h-10 text-indigo-400 mx-auto mb-2" />
            <p className="text-slate-300 font-medium mb-1">Select a ZIP archive or JS/TS test files</p>
            <p className="text-[11px] text-slate-500 mb-3">
              Protected against Zip-Slip & Path Traversal attacks. Up to 25MB uncompressed.
            </p>
            <input
              type="file"
              multiple
              accept=".zip,.js,.ts,.jsx,.tsx,.json"
              onChange={(e) => setUploadFiles(e.target.files)}
              className="text-xs text-slate-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
            />
          </div>

          <div className="text-[11px] text-slate-400 leading-relaxed bg-slate-900/50 p-2.5 rounded border border-slate-800">
            Tip: You can upload your entire project archive as a <code>.zip</code>. TestTruth automatically filters out <code>node_modules</code> and extracts test files and dependencies.
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
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
              Upload & Process
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Confirm Project Deletion"
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 bg-red-950/20 border border-red-900/40 rounded-lg text-red-300 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>
              This will permanently delete the project <strong>"{activeProject?.name}"</strong>, including all source files, AST maps, test mutation runs, and audit reports.
            </span>
          </div>

          <div>
            <label className="block text-slate-300 mb-1">
              Type <strong>{activeProject?.name}</strong> to confirm:
            </label>
            <input
              type="text"
              value={deleteConfirmInput}
              onChange={(e) => setDeleteConfirmInput(e.target.value)}
              placeholder={activeProject?.name}
              className="w-full bg-[#0B0F19] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500 font-mono"
            />
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
            <Button size="sm" variant="ghost" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              variant="danger"
              disabled={deleteConfirmInput !== activeProject?.name}
              onClick={handleDelete}
            >
              Permanently Delete Project
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

