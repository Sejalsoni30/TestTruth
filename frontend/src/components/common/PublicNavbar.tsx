import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Menu,
  X,
  Github,
  Zap,
  Gauge,
  BookOpen,
  DollarSign,
} from 'lucide-react';
import { Button } from './Button.js';
import { authService } from '../../services/authService.js';
import { useAuth } from '../../context/AuthContext.js';

interface PublicNavbarProps {
  className?: string;
}

export const PublicNavbar: React.FC<PublicNavbarProps> = ({ className = '' }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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

  const navLinks = [
    { label: 'Features', href: '/#features', isAnchor: true },
    { label: 'Simulator', href: '/#interactive-demo', isAnchor: true, badge: 'Live' },
    { label: 'Calculator', href: '/#calculator', isAnchor: true },
    { label: 'Pricing', href: '/pricing', isAnchor: false },
    { label: 'Docs', href: '/docs', isAnchor: false },
  ];

  const handleLinkClick = (href: string, isAnchor: boolean) => {
    setMobileMenuOpen(false);
    if (isAnchor && location.pathname === '/') {
      const elementId = href.replace('/#', '');
      const el = document.getElementById(elementId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    navigate(href);
  };

  return (
    <header className={`sticky top-3 sm:top-4 z-50 px-4 sm:px-6 max-w-7xl mx-auto w-full transition-all ${className}`}>
      {/* Floating Glassmorphic Pill */}
      <div className="bg-surface/90 backdrop-blur-xl border border-border/80 rounded-2xl sm:rounded-full px-4 sm:px-6 py-2.5 sm:py-3 shadow-card flex items-center justify-between transition-all hover:border-border-secondary/60">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group select-none">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 8 }}
            whileTap={{ scale: 0.95 }}
            className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shadow-sm"
          >
            <ShieldCheck className="w-5 h-5 text-accent-text" />
          </motion.div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-lg font-mono text-body tracking-tight group-hover:text-accent transition-colors">
              TestTruth
            </span>
            <span className="hidden md:inline-block text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-surface-soft text-muted border border-border">
              v1.0
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((item) => (
            <button
              key={item.label}
              onClick={() => handleLinkClick(item.href, item.isAnchor)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-muted hover:text-body hover:bg-surface-soft/80 transition-all flex items-center gap-1.5 relative group"
            >
              <span>{item.label}</span>
              {item.badge && (
                <span className="px-1.5 py-0.2 text-[9px] font-mono font-bold uppercase rounded-full bg-accent/15 text-accent border border-accent/25">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Right Actions Container */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Live Demo Trigger */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleDemoAccess}
            disabled={demoLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-accent/10 text-accent border border-accent/30 hover:bg-accent hover:text-white transition-all shadow-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>{demoLoading ? 'Starting...' : 'Live Demo'}</span>
          </motion.button>

          {/* GitHub Repo */}
          <a
            href="https://github.com/Sejalsoni30/TestTruth"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-full text-muted hover:text-body hover:bg-surface-soft transition-colors"
            title="GitHub Repository"
          >
            <Github className="w-4 h-4" />
          </a>

          <div className="h-4 w-px bg-border hidden md:block" />

          {/* Auth links */}
          <Link
            to="/login"
            className="text-xs font-semibold text-muted hover:text-body px-2 py-1 transition-colors"
          >
            Sign in
          </Link>

          <Link to="/register">
            <Button size="sm" variant="primary" className="rounded-full shadow-sm">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={handleDemoAccess}
            disabled={demoLoading}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-accent/10 text-accent border border-accent/25"
          >
            <Sparkles className="w-3 h-3 fill-current" />
            <span>Demo</span>
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-xl border border-border text-muted hover:text-body hover:bg-surface-soft"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="sm:hidden mt-2 p-4 rounded-2xl bg-surface/95 backdrop-blur-xl border border-border shadow-xl space-y-3"
          >
            <div className="grid grid-cols-2 gap-2 pt-1 pb-2 border-b border-border">
              {navLinks.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleLinkClick(item.href, item.isAnchor)}
                  className="px-3 py-2 text-left text-xs font-semibold rounded-xl bg-surface-soft/60 text-body hover:bg-surface-soft transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="space-y-2 pt-1">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block">
                <Button size="sm" variant="secondary" className="w-full justify-center">
                  Sign In to Workspace
                </Button>
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="block">
                <Button size="sm" variant="primary" className="w-full justify-center">
                  Create Free Account
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
