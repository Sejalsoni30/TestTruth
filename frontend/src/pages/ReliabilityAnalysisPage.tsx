import React from 'react';
import { useProject } from '../context/ProjectContext.js';
import { Card } from '../components/common/Card.js';
import { ShieldAlert, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';
import { Badge } from '../components/common/Badge.js';

export const ReliabilityAnalysisPage: React.FC = () => {
  const { activeProject } = useProject();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Test Reliability Findings</h1>
        <p className="text-xs text-slate-400 mt-1">
          Evidence-backed detection of weak assertions, run-only tests, missing boundaries, and implementation coupling.
        </p>
      </div>

      {!activeProject ? (
        <Card className="p-8 text-center text-xs text-slate-400">
          <Layers className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
          <p>Please select an active project to view reliability analysis findings.</p>
        </Card>
      ) : (
        <Card className="p-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
            <h3 className="text-sm font-semibold text-white">Classification Standards</h3>
            <div className="flex items-center gap-2">
              <Badge variant="mismatch">Verified mismatch</Badge>
              <Badge variant="survived">Surviving mutation</Badge>
              <Badge variant="weak">Weak assertion</Badge>
              <Badge variant="missing">Missing scenario</Badge>
              <Badge variant="inconclusive">Inconclusive</Badge>
            </div>
          </div>
          <p className="text-xs text-slate-400">
            Phase 4 will execute the automated AST pattern inspection engine on this workspace.
          </p>
        </Card>
      )}
    </div>
  );
};

