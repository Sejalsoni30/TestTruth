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
    <aside className="w-64 bg-sidebar-bg border-r border-[#4F3F48] flex flex-col h-screen shrink-0 sticky top-0 select-none text-sidebar-text">
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-[#4F3F48]">
        <NavLink to="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shadow-sm">
            <ShieldCheck className="w-5 h-5 text-accent-text" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-sidebar-text font-mono">TestTruth</span>
            <span className="text-[10px] text-accent-text/80 block -mt-1 font-mono tracking-widest font-semibold">AUDIT SUITE</span>
          </div>
        </NavLink>
      </div>

      {/* Project Selector Dropdown in Sidebar */}
      <div className="p-4 border-b border-[#4F3F48] bg-[#2A2127]/40">
        <label className="text-[10px] font-mono text-sidebar-muted uppercase tracking-wider block mb-1.5 font-semibold">
          Active Project
        </label>
        <div className="relative">
          <select
            value={activeProject?._id || ''}
            onChange={(e) => {
              const selected = projects.find((p) => p._id === e.target.value);
              if (selected) setActiveProject(selected);
            }}
            className="w-full bg-[#2A2127] border border-[#4F3F48] text-xs text-sidebar-text rounded-xl px-3 py-2 appearance-none focus:outline-none focus:border-accent pr-8 cursor-pointer"
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
          <ChevronDown className="w-3.5 h-3.5 text-sidebar-muted absolute right-3 top-3 pointer-events-none" />
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
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-sidebar-active text-sidebar-text shadow-sm font-semibold'
                    : 'text-sidebar-muted hover:text-sidebar-text hover:bg-sidebar-active/50'
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
      <div className="p-3.5 border border-[#4F3F48] bg-[#2A2127]/60 m-3 rounded-2xl">
        <div className="flex items-center gap-2 text-[11px] font-semibold text-sidebar-text mb-1 font-mono">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
          Honesty Principle
        </div>
        <p className="text-[10px] text-sidebar-muted leading-relaxed">
          TestTruth never claims 100% bug detection. Every finding requires reproducible proof.
        </p>
      </div>
    </aside>
  );
};
