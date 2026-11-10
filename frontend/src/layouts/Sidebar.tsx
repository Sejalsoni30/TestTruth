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
    <aside className="w-64 bg-[#0F172A] border-r border-slate-800 flex flex-col h-screen shrink-0 sticky top-0 select-none">
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800/80">
        <NavLink to="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center shadow-md shadow-indigo-600/30">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-white font-mono">TestTruth</span>
            <span className="text-[10px] text-cyan-400 block -mt-1 font-mono tracking-widest">AUDIT SUITE</span>
          </div>
        </NavLink>
      </div>

      {/* Project Selector Dropdown in Sidebar */}
      <div className="p-4 border-b border-slate-800/60 bg-[#0B0F19]/40">
        <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
          Active Project
        </label>
        <div className="relative">
          <select
            value={activeProject?._id || ''}
            onChange={(e) => {
              const selected = projects.find((p) => p._id === e.target.value);
              if (selected) setActiveProject(selected);
            }}
            className="w-full bg-[#111827] border border-slate-700/80 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 appearance-none focus:outline-none focus:border-indigo-500 pr-7 cursor-pointer"
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
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Honesty Principle Footer Notice */}
      <div className="p-3 border-t border-slate-800/80 bg-[#0B0F19]/60 m-3 rounded-lg border">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-400 mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
          Honesty Principle
        </div>
        <p className="text-[10px] text-slate-400 leading-relaxed">
          TestTruth never claims 100% bug detection. Every finding requires reproducible evidence.
        </p>
      </div>
    </aside>
  );
};

