import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Target, HeartHandshake, Eye, ArrowRight, Dna } from 'lucide-react';
import { Card } from '../components/common/Card.js';
import { Button } from '../components/common/Button.js';
import { Footer } from '../components/common/Footer.js';

export const AboutPage: React.FC = () => {
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
            <span className="hidden sm:inline font-mono text-xs font-semibold text-muted uppercase">About</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/pricing" className="text-xs text-muted hover:text-body">Pricing</Link>
            <Link to="/login"><Button size="sm" variant="primary">Launch App</Button></Link>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <section className="py-16 px-6 max-w-4xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface border border-border text-xs font-semibold text-accent shadow-elevation-sm">
          <Target className="w-3.5 h-3.5" />
          <span>The Truth About Automated Testing</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-body tracking-tight">
          Why We Built TestTruth
        </h1>
        <p className="text-sm sm:text-base text-muted max-w-2xl mx-auto leading-relaxed">
          In an era where AI coding assistants can generate dozens of green tests in seconds, the hardest challenge in software engineering is no longer writing tests—it is knowing whether those tests actually prove anything.
        </p>
      </section>

      {/* Content Pillars */}
      <div className="flex-1 max-w-5xl mx-auto px-6 pb-20 w-full space-y-8 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 space-y-3">
            <div className="w-9 h-9 rounded-full bg-critical/15 text-critical flex items-center justify-center font-bold font-mono">
              01
            </div>
            <h3 className="text-base font-bold text-body">The False Green Problem</h3>
            <p className="text-muted leading-relaxed">
              Coding assistants write tests that go green effortlessly. But many check only that code runs without throwing, or lock in existing faulty behavior with weak assertions like <code className="text-accent font-mono">expect(res).toBeDefined()</code>. Teams ship with false confidence.
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="w-9 h-9 rounded-full bg-accent/15 text-accent flex items-center justify-center font-bold font-mono">
              02
            </div>
            <h3 className="text-base font-bold text-body">Empirical Mutation Proof</h3>
            <p className="text-muted leading-relaxed">
              We subject your codebase to synthetic fault injection. If we invert a boundary condition or negate an authentication check and your test suite continues to report 100% green, you have undeniable, reproducible proof of a test blindspot.
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="w-9 h-9 rounded-full bg-low/15 text-low flex items-center justify-center font-bold font-mono">
              03
            </div>
            <h3 className="text-base font-bold text-body">Zero Vanity Metrics</h3>
            <p className="text-muted leading-relaxed">
              We never promise that your code is 100% defect-free. We refuse to sell unscientific badges. TestTruth delivers measurable sensitivity scores, actionable AST suggestions, and honest limitations.
            </p>
          </Card>
        </div>

        {/* Call to action */}
        <Card className="p-8 bg-surface-soft border border-border text-center space-y-4">
          <h2 className="text-xl font-bold text-body">Audit Your Test Suite Today</h2>
          <p className="text-muted max-w-md mx-auto leading-relaxed">
            Upload your JavaScript or TypeScript project and discover which tests protect your application and which tests only provide an illusion of safety.
          </p>
          <div className="flex justify-center gap-3">
            <Link to="/register"><Button size="md" variant="primary">Start Free Audit</Button></Link>
            <Link to="/pricing"><Button size="md" variant="outline">View Pricing</Button></Link>
          </div>
        </Card>
      </div>

      <Footer />
    </div>
  );
};
