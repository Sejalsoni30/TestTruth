import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Dna, Calculator, Sparkles, Terminal, CheckCircle2, ArrowRight } from 'lucide-react';
import { Card } from '../components/common/Card.js';
import { Button } from '../components/common/Button.js';
import { Badge } from '../components/common/Badge.js';
import { Footer } from '../components/common/Footer.js';

export const MethodologyPage: React.FC = () => {
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
            <span className="hidden sm:inline font-mono text-xs font-semibold text-muted uppercase">Methodology</span>
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
          <Calculator className="w-3.5 h-3.5" />
          <span>Scientific & Deterministic Test Auditing</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-body tracking-tight mb-4">
          The TestTruth Methodology
        </h1>
        <p className="text-sm sm:text-base text-muted max-w-2xl mx-auto leading-relaxed">
          How we evaluate whether test suites actively verify program correctness, using mutation testing, AST inspection, and empirical confidence ratings.
        </p>
      </section>

      {/* Main Content */}
      <div className="flex-1 max-w-5xl mx-auto px-6 pb-20 w-full space-y-10 text-xs">
        {/* Formula Section */}
        <Card className="p-8 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-border">
            <Calculator className="w-5 h-5 text-accent" />
            <h2 className="text-base font-bold text-body">1. The Mutation Kill Rate Formula</h2>
          </div>
          <p className="text-muted leading-relaxed">
            The primary sensitivity metric reported by TestTruth is the Mutation Kill Rate. It evaluates what fraction of synthetically introduced code defects caused at least one test in your suite to fail.
          </p>
          <div className="p-4 bg-code-bg text-code-text rounded-2xl font-mono text-sm border border-border text-center">
            Mutation Kill Rate (%) = (Killed Mutants / Total Generated Mutants) * 100
          </div>
          <div className="p-4 bg-surface-soft rounded-xl border border-border space-y-1 text-[11px] text-muted">
            <span className="font-bold text-body block">Why Kill Rate Beats Line Coverage:</span>
            <span>A test that executes 100 lines of code without a single assertion achieves 100% coverage, yet has a 0% mutation kill rate because every synthetic bug will pass completely unnoticed.</span>
          </div>
        </Card>

        {/* Mutation Operators */}
        <Card className="p-8 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-border">
            <Dna className="w-5 h-5 text-accent" />
            <h2 className="text-base font-bold text-body">2. Supported Synthetic Mutation Operators</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-surface-soft border border-border space-y-1">
              <span className="font-bold text-body block">Boundary Operator Inversion</span>
              <p className="text-muted">Mutates relational thresholds: <code className="text-accent">&gt;=</code> to <code className="text-accent">&gt;</code>, or <code className="text-accent">&lt;=</code> to <code className="text-accent">&lt;</code>.</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-soft border border-border space-y-1">
              <span className="font-bold text-body block">Arithmetic Operator Swapping</span>
              <p className="text-muted">Swaps mathematical operations: <code className="text-accent">+</code> to <code className="text-accent">-</code>, or <code className="text-accent">*</code> to <code className="text-accent">/</code>.</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-soft border border-border space-y-1">
              <span className="font-bold text-body block">Logical Condition Negation</span>
              <p className="text-muted">Inverts boolean conditions: <code className="text-accent">&amp;&amp;</code> to <code className="text-accent">||</code>, or negates truthy checks.</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-soft border border-border space-y-1">
              <span className="font-bold text-body block">Return Value Subversion</span>
              <p className="text-muted">Alters returned values to null, zero, empty arrays, or inverted flags.</p>
            </div>
          </div>
        </Card>

        {/* Inherent Limitations */}
        <Card className="p-8 space-y-4 bg-surface-soft border-accent/40 shadow-elevation-sm">
          <div className="flex items-center gap-2.5 pb-3 border-b border-border">
            <ShieldCheck className="w-5 h-5 text-accent" />
            <h2 className="text-base font-bold text-body">3. Non-Negotiable Honesty & Limitations</h2>
          </div>
          <p className="text-body leading-relaxed">
            TestTruth adheres strictly to scientific honesty. We make no false marketing claims:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-muted">
            <li><strong>Not a Proof:</strong> A 100% kill rate demonstrates high test sensitivity to syntactic code modifications, but does NOT mathematically prove the absence of unspecified defects.</li>
            <li><strong>Equivalent Mutants:</strong> Certain mutations produce behaviorally identical code (e.g. <code className="text-accent">i * 2</code> vs <code className="text-accent">i + i</code>) and cannot be killed by any valid test.</li>
            <li><strong>Human Review:</strong> Tool findings represent empirical indicators. Human architectural judgment remains essential.</li>
          </ul>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

