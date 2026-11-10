import React from 'react';
import { useProject } from '../context/ProjectContext.js';
import { Card } from '../components/common/Card.js';
import { Code2, FileCode, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '../components/common/Button.js';
import { useNavigate } from 'react-router-dom';

export const SourceAnalysisPage: React.FC = () => {
  const { activeProject } = useProject();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Source & Test Suite Analysis</h1>
          <p className="text-xs text-slate-400 mt-1">
            Visual project tree, AST function signatures, branches, and source-to-test mapping.
          </p>
        </div>
        {activeProject && (
          <Button size="sm" variant="primary" onClick={() => navigate('/projects')}>
            Upload / Manage Files
          </Button>
        )}
      </div>

      {!activeProject ? (
        <Card className="p-8 text-center text-xs text-slate-400">
          <AlertCircle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
          <p>Please select an active project from the sidebar or Project Workspace to inspect source analysis.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <FileCode className="w-4 h-4 text-indigo-400" />
              Project File Hierarchy
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              {activeProject.stats?.totalFiles || 0} total files detected ({activeProject.stats?.testFilesCount || 0} tests).
            </p>
            <div className="p-3 bg-[#0B0F19] rounded-lg border border-slate-800 text-xs font-mono text-slate-300">
              <div className="text-indigo-400 font-semibold mb-1">/{activeProject.name}</div>
              <div className="pl-3 text-slate-400">├── src/</div>
              <div className="pl-6 text-slate-300">└── (files indexed)</div>
              <div className="pl-3 text-slate-400">└── test/</div>
              <div className="pl-6 text-cyan-400">└── (test suites detected)</div>
            </div>
          </Card>

          <Card className="lg:col-span-2 p-5">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-cyan-400" />
              AST Inspection Telemetry
            </h3>
            <div className="p-8 text-center text-xs text-slate-400">
              <p>Ready for Phase 3 deep AST analysis and visual tree mapping.</p>
              <p className="mt-1 text-slate-500 font-mono">Framework: {activeProject.framework} | Language: {activeProject.language}</p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

