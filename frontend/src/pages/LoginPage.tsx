import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  ArrowRight,
  Lock,
  Mail,
  AlertCircle,
  Sparkles,
  Eye,
  EyeOff,
  Check,
  KeyRound,
} from 'lucide-react';
import { authService } from '../services/authService.js';
import { useAuth } from '../context/AuthContext.js';
import { Button } from '../components/common/Button.js';
import { Card } from '../components/common/Card.js';
import { Footer } from '../components/common/Footer.js';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  const { login: setAuthUser } = useAuth();
  const navigate = useNavigate();

  const handleDemoLogin = async () => {
    setError(null);
    setDemoLoading(true);
    try {
      const res = await authService.demoLogin();
      setAuthUser(res.token, res.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Demo sign-in failed');
    } finally {
      setDemoLoading(false);
    }
  };

  const handleFillCredentials = (fillEmail: string, fillPass: string) => {
    setEmail(fillEmail);
    setPassword(fillPass);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await authService.login(email, password);
      setAuthUser(res.token, res.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col justify-between selection:bg-accent/20 selection:text-body">
      {/* Top Navbar */}
      <header className="border-b border-border bg-surface sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-5 h-5 text-accent-text" />
            </div>
            <span className="font-bold text-lg font-mono text-body tracking-tight">TestTruth</span>
          </Link>

          <nav className="flex items-center gap-5">
            <Link
              to="/"
              className="text-xs text-muted hover:text-body font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              to="/pricing"
              className="text-xs text-muted hover:text-accent font-medium transition-colors"
            >
              Pricing
            </Link>
            <Link
              to="/docs"
              className="text-xs text-muted hover:text-body font-medium transition-colors"
            >
              Docs
            </Link>
            <button
              onClick={handleDemoLogin}
              disabled={demoLoading}
              className="text-xs text-accent hover:text-accent-hover font-semibold px-2 py-1 transition-colors inline-flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>Live Demo</span>
            </button>
            <Link to="/register">
              <Button size="sm" variant="primary">
                Register
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Form Container */}
      <main className="flex-1 flex items-center justify-center p-6 py-12">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex w-12 h-12 rounded-2xl bg-surface border border-border items-center justify-center shadow-sm mb-3">
              <ShieldCheck className="w-6 h-6 text-accent" />
            </div>
            <h1 className="text-2xl font-bold font-mono text-body tracking-tight">Sign In to TestTruth</h1>
            <p className="text-xs text-muted mt-1">Audit and verify your test suites for false confidence</p>
          </div>

          <Card className="p-8 shadow-card border-border">
            {error && (
              <div className="mb-5 p-3 rounded-xl bg-critical/10 border border-critical/25 flex items-center gap-3 text-critical text-xs animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Quick-fill helper chips */}
            <div className="mb-5 p-3 bg-surface-soft border border-border rounded-xl">
              <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-muted mb-2">
                <KeyRound className="w-3.5 h-3.5 text-accent" />
                <span>Quick Fill Evaluation Accounts:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleFillCredentials('user@gmail.com', 'Password123!')}
                  className="px-2.5 py-1 text-[11px] font-mono rounded-lg bg-surface border border-border hover:border-accent hover:text-accent text-body transition-colors"
                >
                  user@gmail.com
                </button>
                <button
                  type="button"
                  onClick={() => handleFillCredentials('demo@testtruth.io', 'Password123!')}
                  className="px-2.5 py-1 text-[11px] font-mono rounded-lg bg-surface border border-border hover:border-accent hover:text-accent text-body transition-colors"
                >
                  demo@testtruth.io
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-body mb-1.5 font-mono">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-muted absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@gmail.com"
                    className="w-full bg-surface-soft border border-border rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-body placeholder-muted focus:outline-none focus:border-accent transition-colors shadow-sm"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-body font-mono">
                    Password
                  </label>
                  <span className="text-[11px] text-muted font-mono">min 6 chars</span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-muted absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-surface-soft border border-border rounded-xl pl-10 pr-10 py-2.5 text-xs text-body placeholder-muted focus:outline-none focus:border-accent transition-colors shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-muted hover:text-body p-0.5 rounded transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-muted hover:text-body">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-border text-accent focus:ring-accent accent-accent cursor-pointer"
                  />
                  <span>Remember this device</span>
                </label>
                <Link to="/contact" className="text-muted hover:text-accent transition-colors">
                  Need help?
                </Link>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full mt-2"
                isLoading={loading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Sign In to Workspace
              </Button>
            </form>

            <div className="mt-5 pt-5 border-t border-border space-y-3">
              <Button
                type="button"
                variant="secondary"
                className="w-full justify-center text-xs font-semibold"
                onClick={handleDemoLogin}
                isLoading={demoLoading}
                leftIcon={<Sparkles className="w-3.5 h-3.5 text-accent fill-current" />}
              >
                Explore Demo Workspace (1-Click)
              </Button>

              <div className="text-center text-xs text-muted pt-1">
                Don't have an account?{' '}
                <Link to="/register" className="text-accent hover:text-accent-hover font-semibold">
                  Create an account
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </main>

      {/* Footer at the bottom */}
      <Footer />
    </div>
  );
};
