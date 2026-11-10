import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border bg-surface text-body text-xs">
      {/* 4-Column Grid Section */}
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Info Column */}
          <div className="md:col-span-2 space-y-4 pr-6">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shadow-sm">
                <ShieldCheck className="w-5 h-5 text-accent-text" />
              </div>
              <span className="font-bold text-base font-mono text-body tracking-tight">TestTruth</span>
            </Link>
            <p className="text-muted leading-relaxed text-xs">
              TestTruth audits whether your JavaScript and TypeScript test suites actually catch bugs. We detect tests that pass without proving anything using mutation testing, assertion analysis, and isolated sandboxes.
            </p>
            <div className="pt-2 flex items-center gap-2 text-[11px] font-mono text-low font-semibold">
              <span className="w-2 h-2 rounded-full bg-low animate-pulse" />
              <span>Engine Status: Sandbox Runners Operational</span>
            </div>
          </div>

          {/* Column 1: Product */}
          <div className="space-y-3">
            <h4 className="font-mono text-[11px] font-bold uppercase tracking-wider text-body">
              Product
            </h4>
            <ul className="space-y-2 text-muted font-medium">
              <li>
                <Link to="/docs" className="hover:text-accent transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-accent transition-colors">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link to="/changelog" className="hover:text-accent transition-colors">
                  Changelog
                </Link>
              </li>
              <li>
                <Link to="/reports" className="hover:text-accent transition-colors">
                  Sample Report
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-accent transition-colors">
                  Live Workspace
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Resources */}
          <div className="space-y-3">
            <h4 className="font-mono text-[11px] font-bold uppercase tracking-wider text-body">
              Resources
            </h4>
            <ul className="space-y-2 text-muted font-medium">
              <li>
                <Link to="/docs" className="hover:text-accent transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link to="/methodology" className="hover:text-accent transition-colors">
                  Methodology & Math
                </Link>
              </li>
              <li>
                <Link to="/api-reference" className="hover:text-accent transition-colors">
                  API Reference
                </Link>
              </li>
              <li>
                <Link to="/guides" className="hover:text-accent transition-colors">
                  Guides & Tutorials
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-accent transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company & Legal */}
          <div className="space-y-3">
            <h4 className="font-mono text-[11px] font-bold uppercase tracking-wider text-body">
              Company & Legal
            </h4>
            <ul className="space-y-2 text-muted font-medium">
              <li>
                <Link to="/about" className="hover:text-accent transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-accent transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/security" className="hover:text-accent transition-colors">
                  Security Sandbox
                </Link>
              </li>
              <li>
                <Link to="/legal/terms" className="hover:text-accent font-semibold transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/legal/privacy" className="hover:text-accent transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/legal/cookies" className="hover:text-accent transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border bg-surface-soft py-5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-muted text-[11px]">
          <div className="flex items-center gap-2 font-mono">
            <span>© 2026 TestTruth Inc. Built for engineering teams auditing test reliability.</span>
          </div>
          <div className="flex flex-wrap items-center gap-5 font-mono">
            <Link to="/legal/terms" className="hover:text-body transition-colors">
              Terms of Service
            </Link>
            <span className="text-border">•</span>
            <Link to="/legal/privacy" className="hover:text-body transition-colors">
              Privacy Policy
            </Link>
            <span className="text-border">•</span>
            <Link to="/legal/cookies" className="hover:text-body transition-colors">
              Cookies
            </Link>
            <span className="text-border">•</span>
            <Link to="/security" className="hover:text-body transition-colors">
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

