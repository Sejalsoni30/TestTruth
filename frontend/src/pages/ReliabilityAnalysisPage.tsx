import React from 'react';
import { useProject } from '../context/ProjectContext.js';
import { Card } from '../components/common/Card.js';
import { Layers } from 'lucide-react';
import { Badge } from '../components/common/Badge.js';

export const ReliabilityAnalysisPage: React.FC = () => {
  const { activeProject } = useProject();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-body tracking-tight">Test Reliability Findings</h1>
        <p className="text-xs text-muted mt-1">
          Evidence-backed detection of weak assertions, run-only tests, missing boundaries, and implementation coupling.
        </p>
      </div>

      {!activeProject ? (
        <Card className="p-8 text-center text-xs text-muted">
          <Layers className="w-8 h-8 text-accent mx-auto mb-2" />
          <p>Please select an active project to view reliability analysis findings.</p>
        </Card>
      ) : (
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border mb-4 gap-3">
            <h3 className="text-sm font-semibold text-body">Classification Standards</h3>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="mismatch">Verified mismatch</Badge>
              <Badge variant="survived">Surviving mutation</Badge>
              <Badge variant="weak">Weak assertion</Badge>
              <Badge variant="missing">Missing scenario</Badge>
              <Badge variant="inconclusive">Inconclusive</Badge>
            </div>
          </div>
          <p className="text-xs text-muted leading-relaxed">
            Phase 4 will execute the automated AST pattern inspection engine on this workspace.
          </p>
        </Card>
      )}
    </div>
  );
};
