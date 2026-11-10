import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Terminal, Cpu, Clock, Trash2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Card } from '../components/common/Card.js';
import { Button } from '../components/common/Button.js';
import { Footer } from '../components/common/Footer.js';

export const SecurityPage: React.FC = () => {
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
            <span className="hidden sm:inline font-mono text-xs font-semibold text-muted uppercase">Security Architecture</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/pricing" className="text-xs text-muted hover:text-body">Pricing</Link>
            <Link to="/login"><Button size="sm" variant="primary">Launch App</Button></Link>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <section className="py-16 px-6 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface border border-border text-xs font-semibold text-accent mb-4 shadow-elevation-sm">
          <Lock className="w-3.5 h-3.5" />
          <span>Sterile Sandbox Isolation & Truthful Security</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-body tracking-tight mb-4">
          Sandbox Security & Isolation Architecture
        </h1>
        <p className="text-sm sm:text-base text-muted max-w-2xl mx-auto leading-relaxed">
          How TestTruth executes untrusted customer test suites with strict process isolation, resource quotas, and zero credential leakage.
        </p>
      </section>

      {/* Security Pillars */}
      <div className="flex-1 max-w-5xl mx-auto px-6 pb-20 w-full space-y-8 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 space-y-3">
            <div className="w-9 h-9 rounded-full bg-low/15 text-low flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-body">1. Zero Network Access (No Egress)</h3>
            <p className="text-muted leading-relaxed">
              When Docker is available, containers are initialized with <code className="text-accent font-mono">--network none</code>. Untrusted test code cannot connect to external HTTP APIs, exfiltrate data, or access local network devices.
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="w-9 h-9 rounded-full bg-accent/15 text-accent flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-body">2. CPU & Memory Resource Quotas</h3>
            <p className="text-muted leading-relaxed">
              Each execution sandbox is constrained to strict resource limits (512MB RAM and 1 CPU core quota) to guard against memory exhaustion attacks, recursive fork-bombs, and infinite loops.
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="w-9 h-9 rounded-full bg-medium/15 text-medium flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-body">3. Hard Execution Timeout Watchdogs</h3>
            <p className="text-muted leading-relaxed">
              Every baseline test run and mutation execution is monitored by an active <code className="text-accent font-mono">AbortController</code> watchdog. Runs exceeding the timeout threshold (5-10s) are forcefully terminated with SIGKILL.
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="w-9 h-9 rounded-full bg-critical/15 text-critical flex items-center justify-center">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-body">4. Ephemeral Workspace Wiping</h3>
            <p className="text-muted leading-relaxed">
              Temporary working directories (<code className="text-accent font-mono">temp/sandbox_*</code>) exist strictly for the duration of the analysis. Sandboxes are recursively deleted in a <code className="text-accent font-mono">finally</code> block upon completion.
            </p>
          </Card>
        </div>

        {/* Honest Host Fallback Notice */}
        <Card className="p-6 bg-surface-soft border border-border space-y-2">
          <div className="flex items-center gap-2 text-body font-bold text-sm">
            <AlertTriangle className="w-4 h-4 text-medium" />
            <span>Honest Host Environment Communication</span>
          </div>
          <p className="text-muted leading-relaxed">
            Per our rules, we never fake security guarantees. If Docker is not present on the host PATH, TestTruth clearly informs you in the UI and runs inside a sanitized child process sandbox with stripped environment variables and active timeout watchdogs.
          </p>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

