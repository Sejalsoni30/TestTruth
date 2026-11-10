import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderGit2,
  Code2,
  ShieldAlert,
  Dna,
  Terminal,
  Sparkles,
  FileText,
  Settings,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext.js';

export const Sidebar: React.FC = () => {
  const { projects, activeProject, setActiveProject } = useProject();

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/projects', label: 'Project Workspace', icon: FolderGit2 },
    { to: '/source-analysis', label: 'Source Analysis', icon: Code2 },
    { to: '/reliability-analysis', label: 'Reliability Findings', icon: ShieldAlert },
    { to: '/mutation-results', label: 'Mutation Testing', icon: Dna },
    { to: '/execution-details', label: 'Execution Sandbox', icon: Terminal },
    { to: '/ai-scenarios', label: 'AI Scenarios', icon: Sparkles },
    { to: '/reports', label: 'Audit Reports', icon: FileText },
    { to: '/settings', label: 'Engine Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-surface border-r border-border flex flex-col h-screen shrink-0 sticky top-0 select-none transition-colors">
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-border">
        <NavLink to="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-b from-mauve-200 to-mauve-400 flex items-center justify-center shadow-elevation-sm">
            <ShieldCheck className="w-5 h-5 text-mauve-950" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-body font-mono">TestTruth</span>
            <span className="text-[10px] text-accent block -mt-1 font-mono tracking-widest font-semibold">AUDIT SUITE</span>
          </div>
        </NavLink>
      </div>

      {/* Project Selector Dropdown in Sidebar */}
      <div className="p-4 border-b border-border bg-bg/40">
        <label className="text-[10px] font-mono text-muted uppercase tracking-wider block mb-1.5 font-semibold">
          Active Project
        </label>
        <div className="relative">
          <select
            value={activeProject?._id || ''}
            onChange={(e) => {
              const selected = projects.find((p) => p._id === e.target.value);
              if (selected) setActiveProject(selected);
            }}
            className="w-full bg-surface border border-border text-xs text-body rounded-xl px-3 py-2 appearance-none focus:outline-none focus:border-accent pr-8 cursor-pointer shadow-elevation-sm"
          >
            {projects.length === 0 ? (
              <option value="">No projects available</option>
            ) : (
              projects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))
            )}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-muted absolute right-3 top-3 pointer-events-none" />
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-accent/20 text-body border border-accent/40 shadow-elevation-sm font-semibold'
                    : 'text-muted hover:text-body hover:bg-surface-raised'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Honesty Principle Footer Callout */}
      <div className="p-3.5 border border-border bg-surface-raised/70 m-3 rounded-2xl shadow-elevation-sm">
        <div className="flex items-center gap-2 text-[11px] font-semibold text-accent mb-1 font-mono">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
          Honesty Principle
        </div>
        <p className="text-[10px] text-muted leading-relaxed">
          TestTruth never claims 100% bug detection. Every finding requires reproducible proof.
        </p>
      </div>
    </aside>
  );
};
