import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, History, Sparkles, CheckCircle2, GitCommit } from 'lucide-react';
import { Card } from '../components/common/Card.js';
import { Button } from '../components/common/Button.js';
import { Badge } from '../components/common/Badge.js';
import { Footer } from '../components/common/Footer.js';

export const ChangelogPage: React.FC = () => {
  const changelog = [
    {
      version: 'v2.2.0',
      date: 'November 11, 2026',
      badge: 'Latest Release',
      title: 'Full Audit Reports, PDF/JSON Export & Public Legal Suites',
      changes: [
        'Added comprehensive 9-section audit reports detail view with reproduction steps and remediation advice.',
        'Client-side sterile PDF report generator powered by jsPDF.',
        'Structured JSON export endpoint with Content-Disposition headers.',
        'Direct report sharing links with clipboard toast feedback.',
        'Dedicated 4-column footer and editorial Terms of Service, Privacy Policy, and Cookie Policy.',
      ],
    },
    {
      version: 'v2.1.0',
      date: 'November 10, 2026',
      badge: 'Core Feature',
      title: 'Incremental Mutation Runs & SHA-256 Delta Hashing',
      changes: [
        'Implemented SHA-256 cryptographic content hashing for all uploaded project files.',
        'Selective mutation pipeline: only modifies and executes mutants for changed files on subsequent runs.',
        'Cached mutant reuse: unchanged file results are reused directly from prior runs, speeding up audits.',
        'Force full run override toggle in both workspace and mutation matrix.',
      ],
    },
    {
      version: 'v2.0.0',
      date: 'November 8, 2026',
      badge: 'Major Release',
      title: 'AST Assertion Analysis & Isolated Process Sandboxes',
      changes: [
        'Babel AST static inspection detecting run-only tests (zero assertions) and shallow toBeDefined checks.',
        'Isolated child process sandbox runner with CPU/memory limits and timeout kill watchdogs.',
        'Deterministic mutation operators: boundary inversion, arithmetic swapping, boolean condition negation.',
        'New editorial dusty mauve and cream design system with WCAG AA compliant contrast.',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-bg text-body flex flex-col selection:bg-accent/20 selection:text-body">
      {/* Top Navbar */}
      <header className="border-b border-border bg-surface sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-5 h-5 text-accent-text" />
            </div>
            <span className="font-bold text-lg font-mono text-body tracking-tight">TestTruth</span>
            <span className="hidden sm:inline text-border">/</span>
            <span className="hidden sm:inline font-mono text-xs font-semibold text-muted uppercase">Changelog</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/pricing" className="text-xs text-muted hover:text-body">Pricing</Link>
            <Link to="/login"><Button size="sm" variant="primary">Launch App</Button></Link>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <section className="py-16 px-6 max-w-4xl mx-auto text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border text-xs font-semibold text-accent shadow-elevation-sm">
          <History className="w-3.5 h-3.5" />
          <span>Product Updates & Engine Releases</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-body tracking-tight">
          TestTruth Changelog
        </h1>
        <p className="text-xs sm:text-sm text-muted max-w-md mx-auto leading-relaxed">
          Track improvements, new mutation operators, sandbox hardening updates, and audit exports.
        </p>
      </section>

      {/* Timeline List */}
      <div className="flex-1 max-w-3xl mx-auto px-6 pb-20 w-full space-y-6 text-xs font-mono">
        {changelog.map((entry, idx) => (
          <Card key={idx} className="p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-border">
              <div className="flex items-center gap-2.5">
                <span className="font-bold text-base text-body font-mono">{entry.version}</span>
                <Badge variant={idx === 0 ? 'accent' : 'neutral'} size="sm">
                  {entry.badge}
                </Badge>
              </div>
              <span className="text-muted text-[11px] font-mono">{entry.date}</span>
            </div>

            <h3 className="font-bold text-body text-sm font-sans">{entry.title}</h3>

            <ul className="space-y-2 text-muted font-sans text-xs">
              {entry.changes.map((c, cIdx) => (
                <li key={cIdx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-low shrink-0 mt-0.5" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <Footer />
    </div>
  );
};
