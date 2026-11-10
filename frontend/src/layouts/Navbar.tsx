import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User as UserIcon, Cpu, Play } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { useProject } from '../context/ProjectContext.js';
import { Button } from '../components/common/Button.js';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { activeProject } = useProject();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-[#0B0F19]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        {activeProject ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">PROJECT /</span>
            <span className="text-sm font-semibold text-white">{activeProject.name}</span>
            <span className="text-[10px] font-mono uppercase bg-slate-800 text-cyan-400 px-2 py-0.5 rounded border border-slate-700">
              {activeProject.framework}
            </span>
          </div>
        ) : (
          <span className="text-xs text-slate-400">Select or create a project to begin audit</span>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Engine Mode Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-300 text-[11px] font-mono">Mode:</span>
          <span className="text-cyan-400 text-[11px] font-semibold font-mono">Deterministic + Heuristic</span>
        </div>

        {activeProject && (
          <Button
            size="sm"
            variant="primary"
            leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
            onClick={() => navigate('/projects')}
          >
            Trigger Audit Run
          </Button>
        )}

        <div className="h-6 w-px bg-slate-800"></div>

        {/* User profile and logout */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <UserIcon className="w-4 h-4" />
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-medium text-slate-200">{user?.name}</div>
              <div className="text-[10px] text-slate-400">{user?.email}</div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Log out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

