import React from 'react';
import { Card } from '../components/common/Card.js';
import { Sparkles } from 'lucide-react';

export const AIScenariosPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-body tracking-tight">AI Scenario Generation</h1>
        <p className="text-xs text-muted mt-1">
          Synthesizing normal, boundary, negative, exception, edge, and regression scenarios from user specifications.
        </p>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-body">Requirement Separation Principle</h3>
            <p className="text-xs text-muted">
              User-stated requirements are strictly segregated from AI-inferred assumptions.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3.5 bg-bg/80 rounded-xl border border-border text-body">
            <span className="text-low block font-bold mb-1">NORMAL</span>
            Standard valid functional paths
          </div>
          <div className="p-3.5 bg-bg/80 rounded-xl border border-border text-body">
            <span className="text-medium block font-bold mb-1">BOUNDARY</span>
            Off-by-one and threshold values
          </div>
          <div className="p-3.5 bg-bg/80 rounded-xl border border-border text-body">
            <span className="text-critical block font-bold mb-1">NEGATIVE</span>
            Invalid and malformed parameters
          </div>
          <div className="p-3.5 bg-bg/80 rounded-xl border border-border text-body">
            <span className="text-high block font-bold mb-1">EXCEPTION</span>
            Thrown errors & rejection handling
          </div>
          <div className="p-3.5 bg-bg/80 rounded-xl border border-border text-body">
            <span className="text-info block font-bold mb-1">EDGE</span>
            Extremes (empty arrays, max limits)
          </div>
          <div className="p-3.5 bg-bg/80 rounded-xl border border-border text-body">
            <span className="text-accent block font-bold mb-1">REGRESSION</span>
            Past bug prevention assertions
          </div>
        </div>
      </Card>
    </div>
  );
};
