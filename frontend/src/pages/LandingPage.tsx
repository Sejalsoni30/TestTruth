import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  AlertTriangle,
  Dna,
  Terminal,
  Sparkles,
  ArrowRight,
  Code2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  FileCheck,
  Zap,
} from 'lucide-react';
import { Button } from '../components/common/Button.js';
import { Card } from '../components/common/Card.js';
import { Badge } from '../components/common/Badge.js';

export const LandingPage: React.FC = () => {
  // Interactive demo state (Clearly labeled "Sample data")
  const [demoSelectedMutant, setDemoSelectedMutant] = useState<number>(0);

  const sampleMutants = [
    {
      id: 0,
      title: 'Boundary Operator Inversion',
      file: 'src/billing/tierPricing.ts:18',
      type: 'boundary',
      original: 'if (userCount >= 50) return tierDiscount;',
      mutated: 'if (userCount > 50) return tierDiscount;',
      testResult: 'SURVIVED',
      status: 'survived',
      explanation:
        'When userCount equals exactly 50, the discount was omitted, but the existing test suite passed because no test evaluated userCount = 50.',
      evidence: 'test("pricing tier 50 users") checks userCount = 55 and userCount = 10 only.',
    },
    {
      id: 1,
      title: 'Condition Negation in Refund Validator',
      file: 'src/services/refundValidator.ts:34',
      type: 'condition',
      original: 'if (order.isSettled && !order.isDisputed)',
      mutated: 'if (order.isSettled && order.isDisputed)',
      testResult: 'KILLED',
      status: 'killed',
      explanation:
        'Test "should deny refund if disputed" threw an AssertionError when disputed orders were approved.',
      evidence: 'Killing test: "test/refundValidator.test.ts" -> line 42',
    },
    {
      id: 2,
      title: 'Run-Only Test (Zero Assertions)',
      file: 'test/auth/tokenVerification.test.ts:12',
      type: 'weak_assertion',
      original: 'it("verifies valid token", async () => { await verifyToken(jwt); });',
      mutated: 'No mutation needed — test contains 0 assertions',
      testResult: 'WEAK TEST',
      status: 'weak',
      explanation:
        'This test executes the function but asserts nothing. Even if verifyToken returns null or invalid claims, the test passes green.',
      evidence: 'AST Inspection: CallExpression verifyToken has no wrapping expect() or assert().',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 selection:bg-indigo-500/30">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-[#0B0F19]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg font-mono text-white tracking-tight">TestTruth</span>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm text-slate-300 hover:text-white font-medium px-3 py-1.5 transition-colors">
              Log in
            </Link>
            <Link to="/register">
              <Button size="sm" variant="primary">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(99,102,241,0.12),transparent_60%)] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Auditing Test Suite Reliability & AI Test Blindspots</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.15] mb-6">
            Your tests pass. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400">
              But are they actually catching bugs?
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            TestTruth challenges your test suite, detects false confidence, and provides evidence of how reliably your
            tests identify defects.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Start Free Test Audit
              </Button>
            </Link>
            <a href="#interactive-demo">
              <Button size="lg" variant="secondary">
                View Interactive Demo
              </Button>
            </a>
          </div>

          {/* Social Proof / Principle Callout */}
          <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-8 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Reproducible Evidence Backed
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Isolated Sandboxes
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" /> Zero False Claims
            </span>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section id="interactive-demo" className="py-16 px-6 bg-[#0E1526]/60 border-y border-slate-800/80">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 text-[10px] font-mono font-semibold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded">
                  Sample data
                </span>
                <span className="text-xs font-mono text-slate-400">Live Interactive Demonstration</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Inspect How TestTruth Unmasks Weak Tests
              </h2>
            </div>
            <p className="text-sm text-slate-400 max-w-md">
              Explore three real-world scenarios where standard CI tests report 100% green but fail under mutation or
              assertion scrutiny.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left selector */}
            <div className="space-y-3">
              {sampleMutants.map((mutant) => (
                <div
                  key={mutant.id}
                  onClick={() => setDemoSelectedMutant(mutant.id)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                    demoSelectedMutant === mutant.id
                      ? 'bg-slate-800/90 border-indigo-500 shadow-lg shadow-indigo-500/10'
                      : 'bg-[#111827] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-slate-400">{mutant.file}</span>
                    <Badge
                      variant={
                        mutant.status === 'survived'
                          ? 'survived'
                          : mutant.status === 'weak'
                          ? 'weak'
                          : 'success'
                      }
                      size="sm"
                    >
                      {mutant.testResult}
                    </Badge>
                  </div>
                  <h4 className="text-sm font-semibold text-white">{mutant.title}</h4>
                </div>
              ))}
            </div>

            {/* Right details view */}
            <div className="lg:col-span-2">
              <Card className="p-6 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                    <div>
                      <span className="text-xs font-mono text-indigo-400">ANALYSIS EVIDENCE</span>
                      <h3 className="text-base font-bold text-white">
                        {sampleMutants[demoSelectedMutant].title}
                      </h3>
                    </div>
                    <Badge
                      variant={
                        sampleMutants[demoSelectedMutant].status === 'survived'
                          ? 'survived'
                          : sampleMutants[demoSelectedMutant].status === 'weak'
                          ? 'weak'
                          : 'success'
                      }
                    >
                      {sampleMutants[demoSelectedMutant].testResult}
                    </Badge>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <div className="text-xs font-mono text-slate-400 mb-1">Original Code:</div>
                      <pre className="p-3 rounded-lg bg-[#0B0F19] text-slate-200 text-xs font-mono border border-slate-800 overflow-x-auto">
                        {sampleMutants[demoSelectedMutant].original}
                      </pre>
                    </div>

                    <div>
                      <div className="text-xs font-mono text-slate-400 mb-1">Mutated Code (Synthetic Bug):</div>
                      <pre className="p-3 rounded-lg bg-red-950/20 text-red-300 text-xs font-mono border border-red-900/30 overflow-x-auto">
                        {sampleMutants[demoSelectedMutant].mutated}
                      </pre>
                    </div>

                    <div>
                      <div className="text-xs font-mono text-slate-400 mb-1">Why this test is unreliable:</div>
                      <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                        {sampleMutants[demoSelectedMutant].explanation}
                      </p>
                    </div>

                    <div>
                      <div className="text-xs font-mono text-slate-400 mb-1">Evidence & Trace:</div>
                      <p className="text-xs font-mono text-cyan-300 bg-cyan-950/20 p-2.5 rounded-lg border border-cyan-900/30">
                        {sampleMutants[demoSelectedMutant].evidence}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Classified under Non-Negotiable Honesty Guidelines</span>
                  <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1">
                    Audit your repo <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">How TestTruth Works</h2>
          <p className="text-slate-400">
            A three-pillar methodology engineered to evaluate your tests with mathematical rigor and reproducible
            proof.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-6 relative group hover:border-indigo-500/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-5">
              <Code2 className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono text-indigo-400 uppercase mb-2">Step 01</div>
            <h3 className="text-lg font-bold text-white mb-2">AST & Assertion Auditing</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              We parse your code and tests into abstract syntax trees using Tree-sitter. We identify run-only tests with zero assertions, shallow truthiness checks, and unverified branches.
            </p>
          </Card>

          <Card className="p-6 relative group hover:border-cyan-500/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-cyan-600/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-5">
              <Dna className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono text-cyan-400 uppercase mb-2">Step 02</div>
            <h3 className="text-lg font-bold text-white mb-2">Mutation Testing in Sandboxes</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              We inject synthetic mutants (boundary, operator, condition, return-values) and run your tests inside isolated, network-blocked sandboxes. Surviving mutants expose blind spots.
            </p>
          </Card>

          <Card className="p-6 relative group hover:border-emerald-500/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono text-emerald-400 uppercase mb-2">Step 03</div>
            <h3 className="text-lg font-bold text-white mb-2">AI Scenario Synthesis</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Based on expected specifications, TestTruth generates normal, boundary, negative, and exception test cases with counterexamples, separating explicit specs from assumptions.
            </p>
          </Card>
        </div>
      </section>

      {/* Tech Stack Overview */}
      <section className="py-16 px-6 bg-[#0E1526]/40 border-y border-slate-800">
        <div className="max-w-5xl mx-auto text-center">
          <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-8">
            Engineered with Modern, Auditable Technologies
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-6 items-center justify-center text-xs font-mono text-slate-300">
            <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800">TypeScript</div>
            <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800">React 18 / Vite</div>
            <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800">Node & Express</div>
            <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800">Python 3.12</div>
            <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800">Tree-sitter AST</div>
            <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800">MongoDB</div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <Card className="p-6">
            <h4 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-400" />
              What makes TestTruth different from regular test coverage?
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Code coverage only measures which lines of code were executed during a test run. A test that executes 100% of your code with zero assertions achieves 100% coverage while verifying absolutely nothing. TestTruth analyzes assertions, injects bugs via mutation testing, and checks if your tests actually fail when logic breaks.
            </p>
          </Card>

          <Card className="p-6">
            <h4 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-400" />
              Why do you never claim a test suite is "100% reliable"?
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Our Non-Negotiable Honesty Principle dictates that no automated tool can mathematically guarantee zero escaped bugs. Mutation kill rates show test sensitivity; surviving mutants provide evidence of potential blind spots, but human domain requirements remain indispensable.
            </p>
          </Card>

          <Card className="p-6">
            <h4 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-400" />
              How is uploaded code safely executed?
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              All test executions occur inside sterile sandbox environments with zero network access, non-root privileges, strict CPU quotas, memory limits, and automated timeout kill switches. Host environment variables and secrets are never passed into the sandbox.
            </p>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-10 px-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-mono">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>TestTruth © 2026. Auditing test suite reliability with measurable proof.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/login" className="hover:text-slate-200">Log In</Link>
            <Link to="/register" className="hover:text-slate-200">Register</Link>
            <a href="#interactive-demo" className="hover:text-slate-200">Interactive Demo</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

