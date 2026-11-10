import React from 'react';
import { Card } from '../components/common/Card.js';
import { FileText, Download, Printer } from 'lucide-react';
import { Button } from '../components/common/Button.js';

export const ReportsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Audit Reports & Exports</h1>
          <p className="text-xs text-slate-400 mt-1">
            Defensible test quality reports for code reviews, compliance, and team audits.
          </p>
        </div>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Report Generation Engine</h3>
            <p className="text-xs text-slate-400">Exportable as structured JSON and printable PDF</p>
          </div>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Comprehensive per-run reports encapsulate project metadata, AST metrics, weak assertions, mutation kill statistics, missing boundary scenarios, and strict limitations disclosures.
        </p>
      </Card>
    </div>
  );
};

