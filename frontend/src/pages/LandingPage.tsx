import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Dna,
  ArrowRight,
  Code2,
  CheckCircle2,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { Button } from '../components/common/Button.js';
import { Card } from '../components/common/Card.js';
import { Badge } from '../components/common/Badge.js';

export const LandingPage: React.FC = () => {
  const [demoSelectedMutant, setDemoSelectedMutant] = useState<number>(0);

  const sampleMutants = [
    {
      id: 0,
      title: 'Boundary Operator Inversion',
      file: 'src/billing/tierPricing.ts:18',
      type: 'survived',
      original: 'if (userCount >= 50) return tierDiscount;',
      mutated: 'if (userCount > 50) return tierDiscount;',
      testResult: 'SURVIVED',
      status: 'survived' as const,
      explanation:
        'When userCount equals exactly 50, the discount was omitted, but the existing test suite passed because no test evaluated userCount = 50.',
      evidence: 'test("pricing tier 50 users") checks userCount = 55 and userCount = 10 only.',
    },
    {
      id: 1,
      title: 'Condition Negation in Refund Validator',
      file: 'src/services/refundValidator.ts:34',
      type: 'killed',
      original: 'if (order.isSettled && !order.isDisputed)',
      mutated: 'if (order.isSettled && order.isDisputed)',
      testResult: 'KILLED',
      status: 'killed' as const,
      explanation:
        'Test "should deny refund if disputed" threw an AssertionError when disputed orders were approved.',
      evidence: 'Killing test: "test/refundValidator.test.ts" -> line 42',
    },
    {
      id: 2,
      title: 'Run-Only Test (Zero Assertions)',
      file: 'test/auth/tokenVerification.test.ts:12',
      type: 'weak',
      original: 'it("verifies valid token", async () => { await verifyToken(jwt); });',
      mutated: 'No mutation needed — test contains 0 assertions',
      testResult: 'WEAK TEST',
      status: 'weak' as const,
      explanation:
        'This test executes the function but asserts nothing. Even if verifyToken returns null or invalid claims, the test passes green.',
      evidence: 'AST Inspection: CallExpression verifyToken has no wrapping expect() or assert().',
    },
  ];

  return (
    <div className="min-h-screen bg-bg text-body selection:bg-accent/20 selection:text-body">
      {/* Top Navbar in Light Cream & White */}
      <header className="border-b border-border bg-surface sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-5 h-5 text-accent-text" />
            </div>
            <span className="font-bold text-lg font-mono text-body tracking-tight">TestTruth</span>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="text-xs text-muted hover:text-body font-medium px-3 py-1.5 transition-colors">
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

      {/* Hero Section in Dedicated Dark Mauve Gradient with Soft Cream Glow */}
      <section className="hero-gradient text-sidebar-text py-24 px-6 relative">
        <div className="absolute inset-0 hero-glow pointer-events-none"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-sidebar-text text-xs font-medium mb-6 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>Auditing Test Suite Reliability & AI Test Blindspots</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.18] mb-6">
            Your tests pass. <br />
            <span className="text-sidebar-muted">
              But are they actually catching bugs?
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-sidebar-muted max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
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

          {/* Social Proof Callout */}
          <div className="mt-14 pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-8 text-xs text-sidebar-muted font-mono">
            <span className="flex items-center gap-2 text-sidebar-text">
              <CheckCircle2 className="w-4 h-4 text-low" /> Reproducible Evidence Backed
            </span>
            <span className="flex items-center gap-2 text-sidebar-text">
              <CheckCircle2 className="w-4 h-4 text-accent" /> Isolated Sandboxes
            </span>
            <span className="flex items-center gap-2 text-sidebar-text">
              <CheckCircle2 className="w-4 h-4 text-medium" /> Zero False Claims
            </span>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section (Light Cream Background + White Cards) */}
      <section id="interactive-demo" className="py-20 px-6 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-0.5 text-[10px] font-mono font-semibold uppercase bg-medium/10 text-medium border border-medium/20 rounded-full">
                Sample data
              </span>
              <span className="text-xs font-mono text-muted">Live Interactive Demonstration</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-body tracking-tight">
              Inspect How TestTruth Unmasks Weak Tests
            </h2>
          </div>
          <p className="text-xs text-muted max-w-md leading-relaxed">
            Explore three real-world scenarios where tests report 100% green but fail under mutation or
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
                className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                  demoSelectedMutant === mutant.id
                    ? 'bg-surface border-accent shadow-card-hover'
                    : 'bg-surface/80 border-border hover:border-border-secondary hover:bg-surface'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-muted">{mutant.file}</span>
                  <Badge variant={mutant.status} size="sm">
                    {mutant.testResult}
                  </Badge>
                </div>
                <h4 className="text-sm font-semibold text-body">{mutant.title}</h4>
              </div>
            ))}
          </div>

          {/* Right details view */}
          <div className="lg:col-span-2">
            <Card className="p-6 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
                  <div>
                    <span className="text-xs font-mono text-accent font-semibold">ANALYSIS EVIDENCE</span>
                    <h3 className="text-base font-bold text-body">
                      {sampleMutants[demoSelectedMutant].title}
                    </h3>
                  </div>
                  <Badge variant={sampleMutants[demoSelectedMutant].status}>
                    {sampleMutants[demoSelectedMutant].testResult}
                  </Badge>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <div className="text-xs font-mono text-muted mb-1">Original Code:</div>
                    <pre className="p-3.5 rounded-xl bg-code-bg text-code-text text-xs font-mono border border-border overflow-x-auto">
                      {sampleMutants[demoSelectedMutant].original}
                    </pre>
                  </div>

                  <div>
                    <div className="text-xs font-mono text-muted mb-1">Mutated Code (Synthetic Bug):</div>
                    <pre className="p-3.5 rounded-xl bg-code-bg text-critical text-xs font-mono border border-critical/30 overflow-x-auto">
                      {sampleMutants[demoSelectedMutant].mutated}
                    </pre>
                  </div>

                  <div>
                    <div className="text-xs font-mono text-muted mb-1">Why this test is unreliable:</div>
                    <p className="text-sm text-body leading-relaxed bg-surface-soft p-3.5 rounded-xl border border-border">
                      {sampleMutants[demoSelectedMutant].explanation}
                    </p>
                  </div>

                  <div>
                    <div className="text-xs font-mono text-muted mb-1">Evidence & Trace:</div>
                    <p className="text-xs font-mono text-muted bg-surface-soft/60 p-3 rounded-xl border border-border">
                      {sampleMutants[demoSelectedMutant].evidence}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-muted">
                <span>Classified under Non-Negotiable Honesty Guidelines</span>
                <Link to="/register" className="text-accent hover:text-accent-hover font-semibold inline-flex items-center gap-1">
                  Audit your repo <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-t border-border">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-body mb-4 tracking-tight">How TestTruth Works</h2>
          <p className="text-muted text-sm leading-relaxed">
            A three-pillar methodology engineered to evaluate your tests with mathematical rigor and reproducible
            proof.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-6 relative group hover:border-accent transition-colors">
            <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-5 shadow-sm">
              <Code2 className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono text-accent uppercase font-semibold mb-2">Step 01</div>
            <h3 className="text-lg font-bold text-body mb-2">AST & Assertion Auditing</h3>
            <p className="text-xs text-muted leading-relaxed">
              We parse your code and tests into abstract syntax trees using Tree-sitter. We identify run-only tests with zero assertions, shallow truthiness checks, and unverified branches.
            </p>
          </Card>

          <Card className="p-6 relative group hover:border-accent transition-colors">
            <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-5 shadow-sm">
              <Dna className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono text-accent uppercase font-semibold mb-2">Step 02</div>
            <h3 className="text-lg font-bold text-body mb-2">Mutation Testing in Sandboxes</h3>
            <p className="text-xs text-muted leading-relaxed">
              We inject synthetic mutants (boundary, operator, condition, return-values) and run your tests inside isolated, network-blocked sandboxes. Surviving mutants expose blind spots.
            </p>
          </Card>

          <Card className="p-6 relative group hover:border-accent transition-colors">
            <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-5 shadow-sm">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono text-accent uppercase font-semibold mb-2">Step 03</div>
            <h3 className="text-lg font-bold text-body mb-2">AI Scenario Synthesis</h3>
            <p className="text-xs text-muted leading-relaxed">
              Based on expected specifications, TestTruth generates normal, boundary, negative, and exception test cases with counterexamples, separating explicit specs from assumptions.
            </p>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 max-w-4xl mx-auto border-t border-border">
        <h2 className="text-3xl font-bold text-body text-center mb-12 tracking-tight">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <Card className="p-6">
            <h4 className="text-base font-semibold text-body mb-2 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-accent" />
              What makes TestTruth different from regular test coverage?
            </h4>
            <p className="text-xs text-muted leading-relaxed">
              Code coverage only measures which lines of code were executed during a test run. A test that executes 100% of your code with zero assertions achieves 100% coverage while verifying absolutely nothing. TestTruth analyzes assertions, injects bugs via mutation testing, and checks if your tests actually fail when logic breaks.
            </p>
          </Card>

          <Card className="p-6">
            <h4 className="text-base font-semibold text-body mb-2 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-accent" />
              Why do you never claim a test suite is "100% reliable"?
            </h4>
            <p className="text-xs text-muted leading-relaxed">
              Our Non-Negotiable Honesty Principle dictates that no automated tool can mathematically guarantee zero escaped bugs. Mutation kill rates show test sensitivity; surviving mutants provide evidence of potential blind spots, but human domain requirements remain indispensable.
            </p>
          </Card>

          <Card className="p-6">
            <h4 className="text-base font-semibold text-body mb-2 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-accent" />
              How is uploaded code safely executed?
            </h4>
            <p className="text-xs text-muted leading-relaxed">
              All test executions occur inside sterile sandbox environments with zero network access, non-root privileges, strict CPU quotas, memory limits, and automated timeout kill switches. Host environment variables and secrets are never passed into the sandbox.
            </p>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10 px-6 text-center text-xs text-muted">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-mono">
            <ShieldCheck className="w-4 h-4 text-accent" />
            <span>TestTruth © 2026. Auditing test suite reliability with measurable proof.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/login" className="hover:text-body">Log In</Link>
            <Link to="/register" className="hover:text-body">Register</Link>
            <a href="#interactive-demo" className="hover:text-body">Interactive Demo</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
