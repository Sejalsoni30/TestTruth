import React from 'react';
import { Card } from '../components/common/Card.js';
import { Dna } from 'lucide-react';
import { Badge } from '../components/common/Badge.js';

export const MutationResultsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-body tracking-tight">Mutation Testing Engine</h1>
        <p className="text-xs text-muted mt-1">
          Synthetic fault injection: operator, boolean, condition, return-value, and boundary mutants.
        </p>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-critical/15 border border-critical/30 flex items-center justify-center text-critical">
            <Dna className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-body">Mutation Testing Pipeline</h3>
            <p className="text-xs text-muted">Configured for Jest, Vitest, and Isolated Worker Sandboxes</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 my-4">
          <Badge variant="killed">Killed = #8FA58C</Badge>
          <Badge variant="survived">Survived = #C4566A</Badge>
          <Badge variant="timeout">Timeout = #D4B26A</Badge>
          <Badge variant="neutral">No Coverage = #9E8189</Badge>
        </div>

        <p className="text-xs text-muted leading-relaxed">
          In Phase 5, the mutation testing harness injects synthetic faults into project source files, executes test suites in isolated sandboxes, and captures killed vs. survived mutants with full unified diffs.
        </p>
      </Card>
    </div>
  );
};
