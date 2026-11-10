import React from 'react';
import { Card } from '../components/common/Card.js';
import { FileText } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-body tracking-tight">Audit Reports & Exports</h1>
          <p className="text-xs text-muted mt-1">
            Defensible test quality reports for code reviews, compliance, and team audits.
          </p>
        </div>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-body">Report Generation Engine</h3>
            <p className="text-xs text-muted">Exportable as structured JSON and printable PDF</p>
          </div>
        </div>
        <p className="text-xs text-muted leading-relaxed">
          Comprehensive per-run reports encapsulate project metadata, AST metrics, weak assertions, mutation kill statistics, missing boundary scenarios, and strict limitations disclosures.
        </p>
      </Card>
    </div>
  );
};
