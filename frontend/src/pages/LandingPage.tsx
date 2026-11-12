import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Dna,
  ArrowRight,
  Code2,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Zap,
  Gauge,
  Lock,
  Layers,
  Cpu,
} from 'lucide-react';
import { Button } from '../components/common/Button.js';
import { Card } from '../components/common/Card.js';
import { Badge } from '../components/common/Badge.js';
import { Footer } from '../components/common/Footer.js';
import { PublicNavbar } from '../components/common/PublicNavbar.js';
import { authService } from '../services/authService.js';
import { useAuth } from '../context/AuthContext.js';
import { HeroMeshBackground } from '../components/motion/HeroMeshBackground.js';
import { MotionFadeIn } from '../components/motion/MotionFadeIn.js';
import { MotionSpotlightCard } from '../components/motion/MotionSpotlightCard.js';
import { InteractiveMutantSimulator } from '../components/motion/InteractiveMutantSimulator.js';
import { TestSensitivityCalculator } from '../components/motion/TestSensitivityCalculator.js';
import { AnimatedCounter } from '../components/motion/AnimatedCounter.js';

export const LandingPage: React.FC = () => {
  const [demoLoading, setDemoLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleDemoAccess = async () => {
    setDemoLoading(true);
    try {
      const res = await authService.demoLogin();
      login(res.token, res.user);
      navigate('/dashboard');
    } catch (err) {
      console.error('Demo login error:', err);
      navigate('/login');
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-body selection:bg-accent/20 selection:text-body overflow-x-hidden">
      {/* Sleek Floating Glassmorphic Navbar */}
      <PublicNavbar />

      {/* Cinematic Hero Section with Motion Mesh */}
      <section className="hero-gradient text-sidebar-text pt-8 sm:pt-12 pb-14 sm:pb-16 px-6 relative">
        <HeroMeshBackground />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-sidebar-text text-xs font-mono font-medium mb-5 backdrop-blur-md shadow-lg"
          >
            <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
            <span>Auditing Test Suite Reliability & AI Blindspots</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.14] mb-5"
          >
            Your tests pass.{' '}
            <br />
            <span className="bg-gradient-to-r from-[#F7EFE7] via-[#E6D2C4] to-[#C7A9A2] bg-clip-text text-transparent">
              Are they actually catching bugs?
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base sm:text-lg text-sidebar-muted max-w-2xl mx-auto mb-7 leading-relaxed font-normal"
          >
            TestTruth challenges your test suites with automated mutation testing, AST assertion auditing, and isolated sandboxes. Defeat false confidence with reproducible evidence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              size="lg"
              variant="primary"
              onClick={handleDemoAccess}
              isLoading={demoLoading}
              leftIcon={<Sparkles className="w-4 h-4 fill-current" />}
              className="w-full sm:w-auto shadow-xl"
            >
              Launch Live Demo Workspace
            </Button>
            <Link to="/register" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="secondary"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto"
              >
                Create Free Account
              </Button>
            </Link>
          </motion.div>

          {/* Social Proof Callout */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="mt-16 pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-8 text-xs text-sidebar-muted font-mono"
          >
            <span className="flex items-center gap-2 text-sidebar-text">
              <CheckCircle2 className="w-4 h-4 text-low" /> Reproducible Evidence Backed
            </span>
            <span className="flex items-center gap-2 text-sidebar-text">
              <CheckCircle2 className="w-4 h-4 text-accent" /> Isolated Docker Sandboxes
            </span>
            <span className="flex items-center gap-2 text-sidebar-text">
              <CheckCircle2 className="w-4 h-4 text-medium" /> Zero False Confidence Claims
            </span>
          </motion.div>
        </div>
      </section>

      {/* Live Animated Telemetry Ribbon */}
      <section className="bg-surface border-y border-border py-6 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-critical">
              <AnimatedCounter value={92.9} decimals={1} suffix="%" />
            </div>
            <div className="text-xs text-muted font-mono uppercase mt-1">
              Mutant Escape Rate (Sample)
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-body">
              <AnimatedCounter value={14} suffix=" Mutants" />
            </div>
            <div className="text-xs text-muted font-mono uppercase mt-1">
              Synthetic Defects Injected
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-medium">
              <AnimatedCounter value={4} suffix=" Findings" />
            </div>
            <div className="text-xs text-muted font-mono uppercase mt-1">
              Zero-Assertion Test Blindspots
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-low">
              0 ms
            </div>
            <div className="text-xs text-muted font-mono uppercase mt-1">
              Network Leakage (Blocked)
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Interactive Live Sandbox Simulator */}
      <section id="interactive-demo" className="py-20 px-6 max-w-7xl mx-auto scroll-mt-20">
        <MotionFadeIn>
          <InteractiveMutantSimulator />
        </MotionFadeIn>
      </section>

      {/* Section 2: Interactive Vulnerability & False Confidence Calculator */}
      <section id="calculator" className="py-12 px-6 max-w-7xl mx-auto scroll-mt-20">
        <MotionFadeIn delay={0.1}>
          <TestSensitivityCalculator />
        </MotionFadeIn>
      </section>

      {/* Section 3: Three-Pillar Methodology with Motion Spotlight Cards */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto border-t border-border scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-accent/10 text-accent border border-accent/20 mb-3">
            Core Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-body tracking-tight mb-4">
            How TestTruth Audits Your Test Suites
          </h2>
          <p className="text-muted text-sm leading-relaxed">
            A three-pillar methodology engineered to evaluate your tests with mathematical rigor and reproducible proof.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <MotionSpotlightCard className="p-8">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-6 shadow-sm">
              <Code2 className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono text-accent uppercase font-bold mb-2">Step 01</div>
            <h3 className="text-lg font-bold text-body mb-3">AST & Assertion Auditing</h3>
            <p className="text-xs text-muted leading-relaxed">
              We parse your tests into abstract syntax trees using Babel. We uncover tests that execute code without wrapping assertions, evaluate shallow truthiness, or skip error-path rejections.
            </p>
          </MotionSpotlightCard>

          <MotionSpotlightCard className="p-8">
            <div className="w-12 h-12 rounded-2xl bg-critical/10 border border-critical/20 flex items-center justify-center text-critical mb-6 shadow-sm">
              <Dna className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono text-critical uppercase font-bold mb-2">Step 02</div>
            <h3 className="text-lg font-bold text-body mb-3">Sandbox Mutation Testing</h3>
            <p className="text-xs text-muted leading-relaxed">
              We inject synthetic mutants (boundary inversion, operator flipping, return nullification) and execute tests in sterile, network-blocked sandboxes. Surviving mutants expose blind spots.
            </p>
          </MotionSpotlightCard>

          <MotionSpotlightCard className="p-8">
            <div className="w-12 h-12 rounded-2xl bg-low/10 border border-low/20 flex items-center justify-center text-low mb-6 shadow-sm">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono text-low uppercase font-bold mb-2">Step 03</div>
            <h3 className="text-lg font-bold text-body mb-3">AI Scenario Synthesis</h3>
            <p className="text-xs text-muted leading-relaxed">
              For every surviving mutant, TestTruth synthesizes targeted counterexample test cases and asserts boundary conditions, transforming test weaknesses into actionable pull requests.
            </p>
          </MotionSpotlightCard>
        </div>
      </section>

      {/* Section 4: Non-Negotiable Honesty Principle */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <div className="rounded-3xl hero-gradient p-8 sm:p-12 text-sidebar-text relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-white/10 text-white border border-white/20 mb-4">
              <Lock className="w-3 h-3" /> Core Engineering Policy
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-4 tracking-tight">
              The Non-Negotiable Honesty Principle
            </h3>
            <p className="text-sm text-sidebar-muted leading-relaxed mb-6 font-normal">
              TestTruth will never claim a test suite is "100% bug-free" or "fully reliable". A surviving mutant is empirical evidence of a possible weakness, not absolute proof of a defect. We provide transparent sensitivity scores without vanity metrics.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/methodology">
                <Button size="sm" variant="secondary">
                  Read Methodology Whitepaper
                </Button>
              </Link>
              <Link to="/security">
                <Button size="sm" variant="ghost" className="text-white hover:text-white/80">
                  Security & Isolation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: FAQ Section */}
      <section className="py-20 px-6 max-w-4xl mx-auto border-t border-border">
        <h2 className="text-3xl font-bold text-body text-center mb-12 tracking-tight">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <MotionSpotlightCard className="p-6">
            <h4 className="text-sm font-bold text-body mb-2 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-accent" />
              What makes TestTruth different from regular test coverage?
            </h4>
            <p className="text-xs text-muted leading-relaxed">
              Code coverage only measures which lines of code were executed during a test run. A test that executes 100% of your code with zero assertions achieves 100% coverage while verifying absolutely nothing. TestTruth analyzes assertions, injects bugs via mutation testing, and checks if your tests actually fail when logic breaks.
            </p>
          </MotionSpotlightCard>

          <MotionSpotlightCard className="p-6">
            <h4 className="text-sm font-bold text-body mb-2 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-accent" />
              Why do you never claim a test suite is "100% reliable"?
            </h4>
            <p className="text-xs text-muted leading-relaxed">
              Our Non-Negotiable Honesty Principle dictates that no automated tool can mathematically guarantee zero escaped bugs. Mutation kill rates show test sensitivity; surviving mutants provide evidence of potential blind spots, but human domain requirements remain indispensable.
            </p>
          </MotionSpotlightCard>

          <MotionSpotlightCard className="p-6">
            <h4 className="text-sm font-bold text-body mb-2 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-accent" />
              How is uploaded code safely executed?
            </h4>
            <p className="text-xs text-muted leading-relaxed">
              All test executions occur inside sterile sandbox environments with zero network access, non-root privileges, strict CPU quotas, memory limits, and automated timeout kill switches. Host environment variables and secrets are never passed into the sandbox.
            </p>
          </MotionSpotlightCard>
        </div>
      </section>

      {/* 4-Column Footer */}
      <Footer />
    </div>
  );
};
