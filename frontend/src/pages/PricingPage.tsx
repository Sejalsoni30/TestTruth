import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Check,
  X,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Dna,
  Terminal,
  Cpu,
  Lock,
  Layers,
} from 'lucide-react';
import { Card } from '../components/common/Card.js';
import { Button } from '../components/common/Button.js';
import { Badge } from '../components/common/Badge.js';
import { Footer } from '../components/common/Footer.js';
import { authService } from '../services/authService.js';
import { useAuth } from '../context/AuthContext.js';

export const PricingPage: React.FC = () => {
  const [annualBilling, setAnnualBilling] = useState(true);
  const [demoLoading, setDemoLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleDemoAccess = async () => {
    setDemoLoading(true);
    try {
      const res = await authService.demoLogin();
      login(res.token, res.user);
      navigate('/projects');
    } catch (err) {
      console.error('Demo login error:', err);
      navigate('/login');
    } finally {
      setDemoLoading(false);
    }
  };

  const plans = [
    {
      name: 'Developer',
      tagline: 'For solo developers and open-source engineers verifying test sensitivity.',
      priceMonthly: 0,
      priceAnnual: 0,
      popular: false,
      badge: 'Free Forever',
      features: [
        'Up to 5 active codebases',
        '50 incremental mutation runs / mo',
        'Process sandbox with sanitized environment',
        'AST Weak Assertion Detection',
        'Run-Only test detection (zero assertions)',
        'Unified diff mutation viewer',
        'Standard JavaScript & TypeScript support',
        'Community Discord support',
      ],
      ctaText: 'Start Free Audit',
      ctaVariant: 'secondary' as const,
      ctaAction: () => navigate('/register'),
    },
    {
      name: 'Team',
      tagline: 'For engineering teams using AI tools (Copilot, Cursor) where green tests miss bugs.',
      priceMonthly: 49,
      priceAnnual: 39,
      popular: true,
      badge: 'Most Popular',
      features: [
        'Unlimited codebases & test suites',
        'Unlimited fast incremental runs (SHA-256 diffing)',
        'Isolated Docker containers (no network egress, CPU/RAM limits)',
        'AI-suggested test fixes with sandbox verification',
        'Full mutation testing matrix (boundary, operator, condition)',
        'GitHub Actions & CI/CD pull request gatekeeper',
        'Downloadable test quality audit reports (PDF & JSON)',
        'Priority engineer-to-engineer support',
      ],
      ctaText: 'Start 14-Day Free Trial',
      ctaVariant: 'primary' as const,
      ctaAction: () => navigate('/register'),
    },
    {
      name: 'Enterprise',
      tagline: 'For organizations with regulatory audits, air-gapped code, or custom compliance needs.',
      priceMonthly: 199,
      priceAnnual: 159,
      popular: false,
      badge: 'Enterprise Security',
      features: [
        'Everything in Team',
        'Self-hosted sandbox runners on your own cloud/VPC',
        'Custom AST rules & domain mutation operators',
        'Defensible audit reports for SOC2 & regulatory audits',
        'SAML 2.0 / Okta SSO & audit event logging',
        'Custom SLA guarantee (99.9% uptime)',
        'Dedicated Solutions Architect',
        'Invoice billing & custom procurement',
      ],
      ctaText: 'Talk to Engineering',
      ctaVariant: 'secondary' as const,
      ctaAction: () => navigate('/register'),
    },
  ];

  const comparisonCategories = [
    {
      category: 'Analysis & Detection',
      items: [
        { feature: 'AST Weak Assertion Auditing', dev: true, team: true, ent: true },
        { feature: 'Run-Only Test Detection (0 assertions)', dev: true, team: true, ent: true },
        { feature: 'Shallow Truthiness (toBeDefined) flags', dev: true, team: true, ent: true },
        { feature: 'Tautology Detection (true === true)', dev: true, team: true, ent: true },
        { feature: 'Missing Scenario & Exception Analysis', dev: 'Basic', team: 'Advanced', ent: 'Custom' },
        { feature: 'AI Test Fix Generation with Re-run Verification', dev: false, team: true, ent: true },
      ],
    },
    {
      category: 'Mutation Testing Engine',
      items: [
        { feature: 'Incremental Run Hashing (only changed files)', dev: true, team: true, ent: true },
        { feature: 'Cached Mutant Reuse for Unchanged Files', dev: true, team: true, ent: true },
        { feature: 'Force Full Run Capability', dev: true, team: true, ent: true },
        { feature: 'Mutation Kill Rate (%) with formula disclosure', dev: true, team: true, ent: true },
        { feature: 'Unified Mutated Code Diffs', dev: true, team: true, ent: true },
        { feature: 'Custom Mutation Operators', dev: false, team: false, ent: true },
      ],
    },
    {
      category: 'Execution Sandbox & Security',
      items: [
        { feature: 'Execution Environment', dev: 'Process Sandbox', team: 'Docker Isolation', ent: 'VPC / On-Prem' },
        { feature: 'Network Isolation (Zero Egress)', dev: true, team: true, ent: true },
        { feature: 'CPU & Memory Resource Quotas', dev: 'Strict', team: 'Configurable', ent: 'Custom' },
        { feature: 'Execution Timeout Watchdog', dev: true, team: true, ent: true },
        { feature: 'Zip-Slip & Path Traversal Protection', dev: true, team: true, ent: true },
        { feature: 'Zero Host Credential Leaks', dev: true, team: true, ent: true },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-bg text-body selection:bg-accent/20 selection:text-body">
      {/* Top Navbar */}
      <header className="border-b border-border bg-surface sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-5 h-5 text-accent-text" />
            </div>
            <div>
              <span className="font-bold text-lg font-mono text-body tracking-tight">TestTruth</span>
              <span className="hidden sm:inline-block text-[10px] text-muted ml-2 font-mono uppercase font-semibold">PRICING</span>
            </div>
          </Link>

          <nav className="flex items-center gap-6 text-xs font-medium">
            <Link to="/" className="text-muted hover:text-body transition-colors">
              Features
            </Link>
            <Link to="/pricing" className="text-accent font-semibold transition-colors">
              Pricing
            </Link>
            <button
              onClick={handleDemoAccess}
              disabled={demoLoading}
              className="text-muted hover:text-accent font-semibold transition-colors inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>Explore Live Workspace</span>
            </button>
            <Link to="/login" className="text-muted hover:text-body transition-colors">
              Log in
            </Link>
            <Link to="/register">
              <Button size="sm" variant="primary">
                Get Started
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Header */}
      <section className="py-16 px-6 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface border border-border text-xs font-semibold text-accent mb-4 shadow-elevation-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Defensible Test Suite Reliability</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-body tracking-tight mb-4">
          Transparent, Honest Pricing for Engineering Teams
        </h1>
        <p className="text-sm sm:text-base text-muted max-w-2xl mx-auto leading-relaxed">
          Never pay for vanity metrics. TestTruth finds tests that go green without verifying behavior, backs every finding with reproducible proof, and guards against AI coding hallucinations.
        </p>

        {/* 1-Click Live Demo Banner */}
        <div className="mt-8 p-4 bg-surface rounded-2xl border border-accent/40 shadow-elevation-sm max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left text-xs">
            <div className="font-bold text-body flex items-center gap-1.5">
              <Dna className="w-4 h-4 text-accent" />
              <span>Want to inspect the live engine first?</span>
            </div>
            <p className="text-muted mt-0.5">Jump directly into the Weak Calculator project with mutation results.</p>
          </div>
          <Button
            size="sm"
            variant="primary"
            onClick={handleDemoAccess}
            isLoading={demoLoading}
            leftIcon={<Sparkles className="w-3.5 h-3.5 fill-current" />}
          >
            Launch Live Demo App
          </Button>
        </div>

        {/* Billing Cycle Toggle */}
        <div className="flex items-center justify-center gap-3 mt-10">
          <span className={`text-xs font-mono font-semibold ${!annualBilling ? 'text-body' : 'text-muted'}`}>
            Monthly Billing
          </span>
          <button
            onClick={() => setAnnualBilling(!annualBilling)}
            className="w-12 h-6 bg-surface-soft border border-border rounded-full p-1 transition-colors relative"
          >
            <div
              className={`w-4 h-4 rounded-full bg-accent transition-transform ${
                annualBilling ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
          <span className={`text-xs font-mono font-semibold flex items-center gap-1.5 ${annualBilling ? 'text-body' : 'text-muted'}`}>
            Annual Billing
            <span className="bg-low/20 text-low px-2 py-0.5 rounded-full text-[10px] font-bold">
              Save 20%
            </span>
          </span>
        </div>
      </section>

      {/* Pricing Cards Grid */}
      <section className="px-6 max-w-7xl mx-auto pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => {
            const price = annualBilling ? plan.priceAnnual : plan.priceMonthly;
            return (
              <Card
                key={plan.name}
                className={`p-7 flex flex-col justify-between relative transition-all ${
                  plan.popular
                    ? 'border-accent shadow-elevation-md ring-2 ring-accent/30 bg-surface'
                    : 'bg-surface hover:shadow-elevation-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-body">{plan.name}</h3>
                    <Badge variant={plan.popular ? 'accent' : 'neutral'} size="sm">
                      {plan.badge}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted leading-relaxed min-h-[40px] mb-6">
                    {plan.tagline}
                  </p>

                  <div className="mb-6 pb-6 border-b border-border">
                    <div className="flex items-baseline gap-1 font-mono">
                      <span className="text-4xl font-extrabold text-body">${price}</span>
                      <span className="text-xs text-muted">/ month</span>
                    </div>
                    {annualBilling && price > 0 && (
                      <span className="text-[11px] text-low font-mono mt-1 block">
                        Billed annually (${price * 12}/year)
                      </span>
                    )}
                  </div>

                  <div className="space-y-3 mb-8">
                    <span className="text-[11px] font-mono text-muted uppercase font-semibold block">
                      INCLUDED CAPABILITIES:
                    </span>
                    {plan.features.map((f, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-body">
                        <Check className="w-4 h-4 text-low shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  size="md"
                  variant={plan.ctaVariant}
                  onClick={plan.ctaAction}
                  className="w-full justify-center"
                >
                  {plan.ctaText}
                </Button>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Why Teams Pay Section */}
      <section className="py-20 px-6 bg-surface border-y border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-body tracking-tight mb-3">
              Why Engineering Teams Invest in TestTruth
            </h2>
            <p className="text-xs sm:text-sm text-muted">
              Because code coverage does not equal reliability. Here is why teams pay for mutation audits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-bg border border-border">
              <div className="w-10 h-10 rounded-full bg-critical/15 text-critical flex items-center justify-center mb-4">
                <Dna className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-body mb-2">Reduce Escaped Bugs</h3>
              <p className="text-xs text-muted leading-relaxed">
                Catch tests that pass despite inverted conditions, missing boundary checks, or ignored exception paths before code reaches staging or production.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-bg border border-border">
              <div className="w-10 h-10 rounded-full bg-accent/15 text-accent flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-body mb-2">Defensible Quality Reports</h3>
              <p className="text-xs text-muted leading-relaxed">
                Provide verifiable evidence for code reviews, regulatory compliance, and customer security audits showing which parts of your test suite actually prove behavior.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-bg border border-border">
              <div className="w-10 h-10 rounded-full bg-low/15 text-low flex items-center justify-center mb-4">
                <Terminal className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-body mb-2">Stop False AI Confidence</h3>
              <p className="text-xs text-muted leading-relaxed">
                AI coding tools write tests that go green effortlessly. TestTruth audits whether those tests actually assert correctness or merely execute statements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Comparison Matrix */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-body text-center tracking-tight mb-4">
          Detailed Feature Comparison
        </h2>
        <p className="text-xs text-muted text-center max-w-lg mx-auto mb-12">
          Compare engine features across Developer, Team, and Enterprise plans.
        </p>

        <div className="space-y-10">
          {comparisonCategories.map((cat, idx) => (
            <Card key={idx} className="overflow-hidden">
              <div className="p-4 bg-surface-soft border-b border-border font-bold text-xs font-mono text-body uppercase tracking-wider">
                {cat.category}
              </div>
              <div className="divide-y divide-border text-xs">
                {cat.items.map((row, rIdx) => (
                  <div key={rIdx} className="grid grid-cols-12 p-3.5 items-center hover:bg-surface-soft/40 transition-colors">
                    <div className="col-span-6 font-medium text-body">{row.feature}</div>
                    <div className="col-span-2 text-center font-mono">
                      {typeof row.dev === 'boolean' ? (
                        row.dev ? <Check className="w-4 h-4 text-low mx-auto" /> : <X className="w-4 h-4 text-muted/50 mx-auto" />
                      ) : (
                        <span className="text-muted">{row.dev}</span>
                      )}
                    </div>
                    <div className="col-span-2 text-center font-mono">
                      {typeof row.team === 'boolean' ? (
                        row.team ? <Check className="w-4 h-4 text-low mx-auto" /> : <X className="w-4 h-4 text-muted/50 mx-auto" />
                      ) : (
                        <span className="text-body font-semibold">{row.team}</span>
                      )}
                    </div>
                    <div className="col-span-2 text-center font-mono">
                      {typeof row.ent === 'boolean' ? (
                        row.ent ? <Check className="w-4 h-4 text-low mx-auto" /> : <X className="w-4 h-4 text-muted/50 mx-auto" />
                      ) : (
                        <span className="text-accent font-semibold">{row.ent}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Non-Negotiable Honesty Guarantee */}
      <section className="py-16 px-6 max-w-4xl mx-auto border-t border-border">
        <Card className="p-8 bg-surface-soft border-accent/30 shadow-elevation-sm">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-accent/20 text-accent flex items-center justify-center shrink-0 mt-1">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-2 text-xs">
              <h3 className="text-base font-bold text-body">Our Non-Negotiable Honesty Principle</h3>
              <p className="text-body leading-relaxed">
                Unlike traditional testing tools, TestTruth will <strong>never claim your test suite is "fully reliable"</strong> or "100% bug-free". Mutation kill rates demonstrate sensitivity to code alterations; surviving mutants are reproducible evidence of potential weakness, not mathematical proof of a bug.
              </p>
              <p className="text-muted leading-relaxed">
                We will never sell you vanity badges. We deliver reproducible evidence, explicit confidence ratings, and clear disclosure of what automated testing can and cannot prove.
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* Reusable Comprehensive 4-Column Footer */}
      <Footer />
    </div>
  );
};

