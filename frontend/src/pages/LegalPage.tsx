import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Scale,
  Lock,
  Cookie,
  AlertTriangle,
  ArrowLeft,
  Printer,
  CheckCircle2,
  FileText,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { Card } from '../components/common/Card.js';
import { Button } from '../components/common/Button.js';
import { Badge } from '../components/common/Badge.js';
import { Footer } from '../components/common/Footer.js';

export const LegalPage: React.FC = () => {
  const { type = 'terms' } = useParams<{ type: string }>();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'terms' | 'privacy' | 'cookies'>(
    type === 'privacy' ? 'privacy' : type === 'cookies' ? 'cookies' : 'terms'
  );

  useEffect(() => {
    if (type === 'privacy' || type === 'cookies' || type === 'terms') {
      setActiveTab(type);
    }
  }, [type]);

  const handleTabChange = (tab: 'terms' | 'privacy' | 'cookies') => {
    setActiveTab(tab);
    navigate(`/legal/${tab}`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-bg text-body flex flex-col selection:bg-accent/20 selection:text-body">
      {/* Sticky Top Navbar */}
      <header className="border-b border-border bg-surface sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shadow-sm">
                <ShieldCheck className="w-5 h-5 text-accent-text" />
              </div>
              <span className="font-bold text-lg font-mono text-body tracking-tight">TestTruth</span>
            </Link>
            <span className="hidden sm:inline text-border">/</span>
            <span className="hidden sm:inline font-mono text-xs font-semibold text-muted uppercase">
              Legal & Compliance
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="outline"
              leftIcon={<Printer className="w-3.5 h-3.5" />}
              onClick={handlePrint}
            >
              Print / Save PDF
            </Button>
            <Link to="/pricing">
              <Button size="sm" variant="secondary">
                View Pricing
              </Button>
            </Link>
            <Link to="/login">
              <Button size="sm" variant="primary">
                Launch App
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl mx-auto px-6 py-10 w-full">
        {/* Editorial Draft Disclaimer Notice Banner */}
        <div className="mb-8 p-4 rounded-2xl bg-medium/15 border border-medium/30 flex items-start gap-3 shadow-elevation-sm">
          <AlertTriangle className="w-5 h-5 text-medium shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <span className="font-bold text-body">Draft Legal Template:</span>
            <p className="text-muted leading-relaxed">
              This document is a draft template provided for product review and demonstration purposes. Have a qualified legal counsel review and customize these terms before commercial public launch.
            </p>
          </div>
        </div>

        {/* Hero Header & Tabs Switcher */}
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border text-[11px] font-mono text-muted mb-3">
            <Scale className="w-3.5 h-3.5 text-accent" />
            <span>Effective Date: November 11, 2026 • Version 2.4</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-body tracking-tight mb-4">
            {activeTab === 'terms' && 'Terms of Service'}
            {activeTab === 'privacy' && 'Privacy Policy'}
            {activeTab === 'cookies' && 'Cookie Policy'}
          </h1>
          <p className="text-xs sm:text-sm text-muted leading-relaxed">
            {activeTab === 'terms' &&
              'Transparent terms outlining customer code ownership, sandbox execution integrity, and our non-negotiable scientific honesty principles.'}
            {activeTab === 'privacy' &&
              'How TestTruth collects, handles, and immediately sanitizes customer project files and user metadata without training third-party AI models.'}
            {activeTab === 'cookies' &&
              'Clear disclosure of session authentication cookies and local preferences used across our application.'}
          </p>

          {/* Interactive Document Tabs */}
          <div className="inline-flex p-1 bg-surface-soft border border-border rounded-2xl mt-6 shadow-sm">
            <button
              onClick={() => handleTabChange('terms')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
                activeTab === 'terms'
                  ? 'bg-surface text-accent shadow-elevation-sm border border-border'
                  : 'text-muted hover:text-body'
              }`}
            >
              Terms of Service
            </button>
            <button
              onClick={() => handleTabChange('privacy')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
                activeTab === 'privacy'
                  ? 'bg-surface text-accent shadow-elevation-sm border border-border'
                  : 'text-muted hover:text-body'
              }`}
            >
              Privacy Policy
            </button>
            <button
              onClick={() => handleTabChange('cookies')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
                activeTab === 'cookies'
                  ? 'bg-surface text-accent shadow-elevation-sm border border-border'
                  : 'text-muted hover:text-body'
              }`}
            >
              Cookie Policy
            </button>
          </div>
        </div>

        {/* Content Layout: Sticky Table of Contents + Legal Document */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Left Column: Sticky Table of Contents & Quick Facts */}
          <div className="lg:sticky lg:top-24 space-y-4">
            <Card className="p-5">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-body mb-3 pb-2 border-b border-border flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-accent" />
                Table of Contents
              </h3>
              <nav className="space-y-1.5 text-xs text-muted font-medium">
                {activeTab === 'terms' && (
                  <>
                    <a href="#acceptance" className="block hover:text-accent transition-colors py-1">
                      1. Acceptance & Scope
                    </a>
                    <a href="#honesty" className="block hover:text-accent transition-colors py-1 font-semibold text-body">
                      2. Scientific Honesty Principle
                    </a>
                    <a href="#sandboxing" className="block hover:text-accent transition-colors py-1">
                      3. Sandbox Code Execution
                    </a>
                    <a href="#ownership" className="block hover:text-accent transition-colors py-1 font-semibold text-body">
                      4. Customer Code Ownership
                    </a>
                    <a href="#acceptable-use" className="block hover:text-accent transition-colors py-1">
                      5. Permitted & Prohibited Use
                    </a>
                    <a href="#fees" className="block hover:text-accent transition-colors py-1">
                      6. Subscriptions & Billing
                    </a>
                    <a href="#liability" className="block hover:text-accent transition-colors py-1">
                      7. Disclaimers & Liability
                    </a>
                    <a href="#governing-law" className="block hover:text-accent transition-colors py-1">
                      8. Governing Law
                    </a>
                  </>
                )}

                {activeTab === 'privacy' && (
                  <>
                    <a href="#data-collection" className="block hover:text-accent transition-colors py-1">
                      1. Information We Collect
                    </a>
                    <a href="#zero-training" className="block hover:text-accent transition-colors py-1 font-semibold text-body">
                      2. No AI Training on Code
                    </a>
                    <a href="#retention" className="block hover:text-accent transition-colors py-1">
                      3. Ephemeral Code Retention
                    </a>
                    <a href="#subprocessors" className="block hover:text-accent transition-colors py-1">
                      4. Security & Infrastructure
                    </a>
                    <a href="#user-rights" className="block hover:text-accent transition-colors py-1">
                      5. GDPR & CCPA Rights
                    </a>
                  </>
                )}

                {activeTab === 'cookies' && (
                  <>
                    <a href="#cookie-types" className="block hover:text-accent transition-colors py-1">
                      1. Cookies Used
                    </a>
                    <a href="#no-tracking" className="block hover:text-accent transition-colors py-1 font-semibold text-body">
                      2. Zero Ad Tracking
                    </a>
                    <a href="#manage-cookies" className="block hover:text-accent transition-colors py-1">
                      3. Managing Preferences
                    </a>
                  </>
                )}
              </nav>
            </Card>

            <Card className="p-4 bg-surface-soft border border-border text-xs space-y-2 font-mono">
              <span className="text-[10px] uppercase font-semibold text-muted block">LEGAL CONTACT</span>
              <p className="text-body font-semibold">legal@testtruth.io</p>
              <p className="text-muted text-[11px]">TestTruth Inc. — Delaware, USA</p>
            </Card>
          </div>

          {/* Right Column: Full Document Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* ---------------- TERMS OF SERVICE ---------------- */}
            {activeTab === 'terms' && (
              <div className="space-y-6 text-xs leading-relaxed text-body">
                {/* Section 1 */}
                <Card id="acceptance" className="p-6 space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-border">
                    <span className="font-mono text-accent font-bold">01</span>
                    <h2 className="text-base font-bold text-body">Acceptance of Terms</h2>
                  </div>
                  <p>
                    By creating an account, uploading source code archives, invoking our REST API, or accessing any TestTruth auditing services ("Service"), you agree to be bound by these Terms of Service. If you are entering into these Terms on behalf of an engineering organization, you represent that you possess legal authority to bind such entity.
                  </p>
                </Card>

                {/* Section 2 - Honesty */}
                <Card id="honesty" className="p-6 space-y-3 border-l-4 border-l-accent bg-surface">
                  <div className="flex items-center gap-2 pb-2 border-b border-border">
                    <span className="font-mono text-accent font-bold">02</span>
                    <h2 className="text-base font-bold text-body">Non-Negotiable Scientific Honesty Principle</h2>
                  </div>
                  <p className="font-medium text-body">
                    TestTruth is built on uncompromising empirical honesty. You acknowledge and accept that:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-muted">
                    <li>
                      <strong className="text-body">No "100% Bug-Free" Guarantee:</strong> TestTruth will never claim that your test suite or codebase is mathematically bug-free or infallible.
                    </li>
                    <li>
                      <strong className="text-body">Evidence of Weakness vs. Proof:</strong> A surviving mutant is measurable evidence of a possible test suite blindspot, not conclusive proof of a functional application defect.
                    </li>
                    <li>
                      <strong className="text-body">Equivalent Mutants:</strong> In mutation testing, syntactically altered code may occasionally be behaviorally equivalent to original logic. We clearly disclose confidence bounds and limitations.
                    </li>
                  </ul>
                </Card>

                {/* Section 3 - Sandbox */}
                <Card id="sandboxing" className="p-6 space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-border">
                    <span className="font-mono text-accent font-bold">03</span>
                    <h2 className="text-base font-bold text-body">Uploaded Code & Sterile Sandbox Execution</h2>
                  </div>
                  <p>
                    To measure test reliability, TestTruth executes your test suites in isolated sandboxes. We guarantee the following security boundaries:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-[11px] pt-1">
                    <div className="p-3 bg-surface-soft rounded-xl border border-border flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-low shrink-0 mt-0.5" />
                      <span>Zero network egress during test execution</span>
                    </div>
                    <div className="p-3 bg-surface-soft rounded-xl border border-border flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-low shrink-0 mt-0.5" />
                      <span>Hard CPU & memory resource quotas</span>
                    </div>
                    <div className="p-3 bg-surface-soft rounded-xl border border-border flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-low shrink-0 mt-0.5" />
                      <span>Automated execution timeout watchdogs</span>
                    </div>
                    <div className="p-3 bg-surface-soft rounded-xl border border-border flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-low shrink-0 mt-0.5" />
                      <span>Complete workspace cleanup upon run completion</span>
                    </div>
                  </div>
                </Card>

                {/* Section 4 - Ownership */}
                <Card id="ownership" className="p-6 space-y-3 border-l-4 border-l-low bg-surface">
                  <div className="flex items-center gap-2 pb-2 border-b border-border">
                    <span className="font-mono text-low font-bold">04</span>
                    <h2 className="text-base font-bold text-body">Customer Code & Intellectual Property Ownership</h2>
                  </div>
                  <p>
                    <strong className="text-body">You retain 100% exclusive ownership of all uploaded code, test scripts, and audit telemetry.</strong>
                  </p>
                  <p className="text-muted leading-relaxed">
                    TestTruth claims zero intellectual property rights over your proprietary software. Furthermore, we explicitly commit that <strong className="text-body">customer code is NEVER used to train, fine-tune, or calibrate public or third-party artificial intelligence models</strong>.
                  </p>
                </Card>

                {/* Section 5 - Acceptable Use */}
                <Card id="acceptable-use" className="p-6 space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-border">
                    <span className="font-mono text-accent font-bold">05</span>
                    <h2 className="text-base font-bold text-body">Permitted & Prohibited Use</h2>
                  </div>
                  <p>
                    You agree not to upload intentionally malicious payloads, malware, cryptominers, or code designed to exploit host kernels or break sandbox isolation. Any attempt to probe undocumented network boundaries or conduct denial-of-service operations will result in immediate termination.
                  </p>
                </Card>

                {/* Section 6 - Fees */}
                <Card id="fees" className="p-6 space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-border">
                    <span className="font-mono text-accent font-bold">06</span>
                    <h2 className="text-base font-bold text-body">Subscriptions, Billing & Cancellations</h2>
                  </div>
                  <p>
                    Paid tiers (Team and Enterprise) are billed on a recurring monthly or annual basis. You may cancel your subscription at any time via the billing portal. Cancellation will take effect at the conclusion of your current prepaid billing cycle.
                  </p>
                </Card>

                {/* Section 7 - Liability */}
                <Card id="liability" className="p-6 space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-border">
                    <span className="font-mono text-accent font-bold">07</span>
                    <h2 className="text-base font-bold text-body">Disclaimers & Limitation of Liability</h2>
                  </div>
                  <p className="text-muted">
                    TestTruth is provided "as is" and "as available". In no event shall TestTruth Inc. be liable for indirect, punitive, or consequential damages resulting from escaped production defects or unasserted business logic in software audited by the Service.
                  </p>
                </Card>

                {/* Section 8 - Law */}
                <Card id="governing-law" className="p-6 space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-border">
                    <span className="font-mono text-accent font-bold">08</span>
                    <h2 className="text-base font-bold text-body">Governing Law</h2>
                  </div>
                  <p className="text-muted">
                    These Terms are governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law provisions.
                  </p>
                </Card>
              </div>
            )}

            {/* ---------------- PRIVACY POLICY ---------------- */}
            {activeTab === 'privacy' && (
              <div className="space-y-6 text-xs leading-relaxed text-body">
                <Card id="data-collection" className="p-6 space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-border">
                    <span className="font-mono text-accent font-bold">01</span>
                    <h2 className="text-base font-bold text-body">Information We Collect</h2>
                  </div>
                  <p>
                    We collect minimal personal information necessary to deliver authenticated services: your name, email address, password hash (salted using bcrypt), and billing address. We do not sell personal data.
                  </p>
                </Card>

                <Card id="zero-training" className="p-6 space-y-3 border-l-4 border-l-accent bg-surface">
                  <div className="flex items-center gap-2 pb-2 border-b border-border">
                    <span className="font-mono text-accent font-bold">02</span>
                    <h2 className="text-base font-bold text-body">Zero AI Model Training on Customer Code</h2>
                  </div>
                  <p className="font-semibold text-body">
                    We maintain a strict zero-retention guarantee for AI training:
                  </p>
                  <p className="text-muted">
                    Customer code uploaded to TestTruth is never used to train, retrain, or improve machine learning models. When AI-assisted test fix generation is requested, snippets are processed through zero-data-retention APIs and discarded.
                  </p>
                </Card>

                <Card id="retention" className="p-6 space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-border">
                    <span className="font-mono text-accent font-bold">03</span>
                    <h2 className="text-base font-bold text-body">Ephemeral Code Retention & Deletion</h2>
                  </div>
                  <p>
                    You maintain full control over project data. When you delete a project via the Project Workspace, all associated source code, AST maps, mutation results, and audit runs are permanently purged across all databases.
                  </p>
                </Card>

                <Card id="user-rights" className="p-6 space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-border">
                    <span className="font-mono text-accent font-bold">04</span>
                    <h2 className="text-base font-bold text-body">GDPR & CCPA Rights</h2>
                  </div>
                  <p>
                    Users in the European Union and California possess the right to access, rectify, export, and erase their personal data upon request by contacting <span className="font-mono text-accent">privacy@testtruth.io</span>.
                  </p>
                </Card>
              </div>
            )}

            {/* ---------------- COOKIE POLICY ---------------- */}
            {activeTab === 'cookies' && (
              <div className="space-y-6 text-xs leading-relaxed text-body">
                <Card id="cookie-types" className="p-6 space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-border">
                    <span className="font-mono text-accent font-bold">01</span>
                    <h2 className="text-base font-bold text-body">Cookies & Storage Used</h2>
                  </div>
                  <p>
                    TestTruth uses strictly necessary authentication tokens and local browser storage to keep you securely signed in and preserve active project selections.
                  </p>
                </Card>

                <Card id="no-tracking" className="p-6 space-y-3 border-l-4 border-l-low bg-surface">
                  <div className="flex items-center gap-2 pb-2 border-b border-border">
                    <span className="font-mono text-low font-bold">02</span>
                    <h2 className="text-base font-bold text-body">Zero Third-Party Advertising Trackers</h2>
                  </div>
                  <p className="text-muted leading-relaxed">
                    We do not embed third-party advertising cookies, retargeting pixels, or behavioral tracking scripts. We value your engineering privacy.
                  </p>
                </Card>

                <Card id="manage-cookies" className="p-6 space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-border">
                    <span className="font-mono text-accent font-bold">03</span>
                    <h2 className="text-base font-bold text-body">Managing Cookie Preferences</h2>
                  </div>
                  <p className="text-muted">
                    You can configure your browser to block or alert you about cookies, although disabling authentication tokens will prevent you from accessing authenticated workspace dashboards.
                  </p>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reusable Comprehensive 4-Column Footer */}
      <Footer />
    </div>
  );
};
