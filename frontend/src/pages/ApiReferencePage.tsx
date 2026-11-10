import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Terminal, Copy, Check, ExternalLink, Code2 } from 'lucide-react';
import { Card } from '../components/common/Card.js';
import { Button } from '../components/common/Button.js';
import { Badge } from '../components/common/Badge.js';
import { Footer } from '../components/common/Footer.js';

interface Endpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  category: string;
  summary: string;
  authRequired: boolean;
  requestBody?: string;
  responseBody: string;
}

export const ApiReferencePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const endpoints: Endpoint[] = [
    {
      category: 'System',
      method: 'GET',
      path: '/api/health',
      summary: 'Returns backend server health, uptime, and AI provider status.',
      authRequired: false,
      responseBody: '{\n  "status": "ok",\n  "service": "TestTruth Backend API",\n  "uptime": 1284.5,\n  "aiProvider": "none"\n}',
    },
    {
      category: 'Authentication',
      method: 'POST',
      path: '/api/auth/register',
      summary: 'Register a new engineering user and obtain a JWT bearer token.',
      authRequired: false,
      requestBody: '{\n  "email": "engineer@company.com",\n  "password": "Password123!",\n  "name": "Alex Rivera"\n}',
      responseBody: '{\n  "token": "eyJhbGciOi...",\n  "user": { "id": "6af3...", "email": "engineer@company.com" }\n}',
    },
    {
      category: 'Authentication',
      method: 'POST',
      path: '/api/auth/login',
      summary: 'Authenticate with email and password to receive a JWT session token.',
      authRequired: false,
      requestBody: '{\n  "email": "engineer@company.com",\n  "password": "Password123!"\n}',
      responseBody: '{\n  "token": "eyJhbGciOi...",\n  "user": { "id": "6af3...", "name": "Alex Rivera" }\n}',
    },
    {
      category: 'Projects',
      method: 'POST',
      path: '/api/projects',
      summary: 'Create a new project workspace for test suite inspection.',
      authRequired: true,
      requestBody: '{\n  "name": "Billing Gateway",\n  "framework": "jest",\n  "language": "javascript"\n}',
      responseBody: '{\n  "project": {\n    "_id": "6af3...",\n    "name": "Billing Gateway",\n    "framework": "jest"\n  }\n}',
    },
    {
      category: 'Projects',
      method: 'POST',
      path: '/api/projects/:id/upload',
      summary: 'Upload ZIP archive or source files with path traversal security protection.',
      authRequired: true,
      requestBody: 'multipart/form-data with "files" stream (.zip, .js, .ts)',
      responseBody: '{\n  "message": "Uploaded and processed 4 files (2 source, 1 test)",\n  "stats": { "totalFiles": 4 }\n}',
    },
    {
      category: 'Runs & Mutations',
      method: 'POST',
      path: '/api/runs/start',
      summary: 'Trigger an incremental or forced full mutation testing run in the sandbox.',
      authRequired: true,
      requestBody: '{\n  "projectId": "6af3...",\n  "forceFullRun": false\n}',
      responseBody: '{\n  "runId": "6af3...",\n  "status": "running",\n  "message": "Analysis run initiated"\n}',
    },
    {
      category: 'Runs & Mutations',
      method: 'GET',
      path: '/api/runs/:runId/status',
      summary: 'Poll real-time execution progress stage (queued -> running tests -> mutating -> analysing -> done).',
      authRequired: true,
      responseBody: '{\n  "runId": "6af3...",\n  "status": "completed",\n  "progressStage": "done",\n  "isIncremental": true,\n  "changedFilesCount": 1,\n  "reusedMutantsCount": 4\n}',
    },
    {
      category: 'Runs & Mutations',
      method: 'GET',
      path: '/api/runs/:runId',
      summary: 'Retrieve complete audit telemetry, AST findings list, and mutation matrix.',
      authRequired: true,
      responseBody: '{\n  "run": { "summaryMetrics": { "killRate": 7.1 } },\n  "findings": [...],\n  "mutations": [...]\n}',
    },
    {
      category: 'Runs & Mutations',
      method: 'GET',
      path: '/api/runs/:runId/export-json',
      summary: 'Download the certified defensible reliability report as structured JSON.',
      authRequired: true,
      responseBody: '{\n  "reportType": "TestTruth Defensible Reliability Audit",\n  "version": "2.0.0",\n  "findings": [...]\n}',
    },
    {
      category: 'Contact',
      method: 'POST',
      path: '/api/contact',
      summary: 'Submit inquiry message, validated with Zod and saved to MongoDB.',
      authRequired: false,
      requestBody: '{\n  "name": "Taylor",\n  "email": "taylor@org.io",\n  "subject": "CI Gate",\n  "message": "Details..."\n}',
      responseBody: '{\n  "success": true,\n  "message": "Your message has been securely recorded."\n}',
    },
  ];

  const categories = ['All', 'System', 'Authentication', 'Projects', 'Runs & Mutations', 'Contact'];

  const filtered = selectedCategory === 'All'
    ? endpoints
    : endpoints.filter((e) => e.category === selectedCategory);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="min-h-screen bg-bg text-body flex flex-col selection:bg-accent/20 selection:text-body">
      <header className="border-b border-border bg-surface sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-5 h-5 text-accent-text" />
            </div>
            <span className="font-bold text-lg font-mono text-body tracking-tight">TestTruth</span>
            <span className="hidden sm:inline text-border">/</span>
            <span className="hidden sm:inline font-mono text-xs font-semibold text-muted uppercase">REST API Reference</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/pricing" className="text-xs text-muted hover:text-body">Pricing</Link>
            <Link to="/login"><Button size="sm" variant="primary">Launch App</Button></Link>
          </div>
        </div>
      </header>

      <section className="py-14 px-6 max-w-5xl mx-auto text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface border border-border text-xs font-semibold text-accent shadow-elevation-sm">
          <Terminal className="w-3.5 h-3.5" />
          <span>REST API Documentation (v2.2)</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-body tracking-tight">
          TestTruth REST API Reference
        </h1>
        <p className="text-xs sm:text-sm text-muted max-w-lg mx-auto leading-relaxed">
          Programmatic endpoints to upload code, execute incremental mutation runs, retrieve AST findings, and export audit reports.
        </p>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                selectedCategory === cat
                  ? 'bg-accent text-accent-text font-semibold shadow-sm'
                  : 'bg-surface border border-border text-muted hover:text-body'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <div className="flex-1 max-w-5xl mx-auto px-6 pb-20 w-full space-y-6">
        {filtered.map((ep, idx) => (
          <Card key={idx} className="p-6 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border">
              <div className="flex items-center gap-2.5 font-mono text-xs">
                <span
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] ${
                    ep.method === 'GET'
                      ? 'bg-low/15 text-low'
                      : ep.method === 'POST'
                      ? 'bg-accent/15 text-accent'
                      : ep.method === 'PUT'
                      ? 'bg-medium/15 text-medium'
                      : 'bg-critical/15 text-critical'
                  }`}
                >
                  {ep.method}
                </span>
                <span className="font-bold text-body text-sm">{ep.path}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={ep.authRequired ? 'accent' : 'neutral'} size="sm">
                  {ep.authRequired ? 'Bearer Auth Required' : 'Public'}
                </Badge>
                <button
                  onClick={() => handleCopy(`${ep.method} ${ep.path}`, idx)}
                  className="p-1.5 text-muted hover:text-body rounded-lg hover:bg-surface-soft"
                  title="Copy endpoint"
                >
                  {copiedIndex === idx ? <Check className="w-4 h-4 text-low" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <p className="text-xs text-muted leading-relaxed">{ep.summary}</p>

            {ep.requestBody && (
              <div>
                <span className="text-[10px] font-mono text-muted uppercase font-semibold block mb-1">Request Body:</span>
                <pre className="p-3 bg-code-bg text-code-text rounded-xl font-mono text-[11px] overflow-x-auto border border-border">
                  {ep.requestBody}
                </pre>
              </div>
            )}

            <div>
              <span className="text-[10px] font-mono text-muted uppercase font-semibold block mb-1">Response (200 OK):</span>
              <pre className="p-3 bg-code-bg text-code-text rounded-xl font-mono text-[11px] overflow-x-auto border border-border">
                {ep.responseBody}
              </pre>
            </div>
          </Card>
        ))}
      </div>

      <Footer />
    </div>
  );
};

