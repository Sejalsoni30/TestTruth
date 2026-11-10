import React from 'react';
import { Card } from '../components/common/Card.js';
import { Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { Badge } from '../components/common/Badge.js';

export const AIScenariosPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">AI Scenario Generation</h1>
        <p className="text-xs text-slate-400 mt-1">
          Synthesizing normal, boundary, negative, exception, edge, and regression scenarios from user specifications.
        </p>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Requirement Separation Principle</h3>
            <p className="text-xs text-slate-400">
              User-stated requirements are strictly segregated from AI-inferred assumptions.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3 bg-[#0B0F19] rounded border border-slate-800 text-slate-300">
            <span className="text-emerald-400 block font-bold mb-1">NORMAL</span>
            Standard valid functional paths
          </div>
          <div className="p-3 bg-[#0B0F19] rounded border border-slate-800 text-slate-300">
            <span className="text-amber-400 block font-bold mb-1">BOUNDARY</span>
            Off-by-one and threshold values
          </div>
          <div className="p-3 bg-[#0B0F19] rounded border border-slate-800 text-slate-300">
            <span className="text-red-400 block font-bold mb-1">NEGATIVE</span>
            Invalid and malformed parameters
          </div>
          <div className="p-3 bg-[#0B0F19] rounded border border-slate-800 text-slate-300">
            <span className="text-purple-400 block font-bold mb-1">EXCEPTION</span>
            Thrown errors & rejection handling
          </div>
          <div className="p-3 bg-[#0B0F19] rounded border border-slate-800 text-slate-300">
            <span className="text-cyan-400 block font-bold mb-1">EDGE</span>
            Extremes (empty arrays, max limits)
          </div>
          <div className="p-3 bg-[#0B0F19] rounded border border-slate-800 text-slate-300">
            <span className="text-indigo-400 block font-bold mb-1">REGRESSION</span>
            Past bug prevention assertions
          </div>
        </div>
      </Card>
    </div>
  );
};

