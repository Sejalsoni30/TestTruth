import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User as UserIcon, Cpu, Play, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { useProject } from '../context/ProjectContext.js';
import { useTheme } from '../context/ThemeContext.js';
import { Button } from '../components/common/Button.js';
import { Badge } from '../components/common/Badge.js';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { activeProject } = useProject();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 border-b border-border bg-surface/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30 transition-colors">
      <div className="flex items-center gap-3">
        {activeProject ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted font-mono">PROJECT /</span>
            <span className="text-sm font-semibold text-body">{activeProject.name}</span>
            <Badge variant="neutral" size="sm">
              {activeProject.framework.toUpperCase()}
            </Badge>
          </div>
        ) : (
          <span className="text-xs text-muted">Select or create a workspace to begin audit</span>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Engine Mode Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-surface-raised border border-border text-xs">
          <Cpu className="w-3.5 h-3.5 text-accent" />
          <span className="text-muted text-[11px] font-mono">Engine:</span>
          <span className="text-body text-[11px] font-semibold font-mono">Deterministic Rules</span>
        </div>

        {/* Theme Toggle Button (Dark Mauve / Light Cream) */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Cream theme' : 'Switch to Dark Mauve theme'}
          className="p-2 rounded-full border border-border bg-surface-raised text-muted hover:text-body hover:border-accent transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-accent" /> : <Moon className="w-4 h-4 text-accent" />}
        </button>

        {activeProject && (
          <Button
            size="sm"
            variant="primary"
            leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
            onClick={() => navigate('/projects')}
          >
            Audit Suite
          </Button>
        )}

        <div className="h-5 w-px bg-border"></div>

        {/* User profile & Logout */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent">
              <UserIcon className="w-4 h-4" />
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-semibold text-body leading-tight">{user?.name}</div>
              <div className="text-[10px] text-muted leading-tight">{user?.email}</div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Log out"
            className="p-1.5 rounded-full text-muted hover:text-body hover:bg-surface-raised transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
