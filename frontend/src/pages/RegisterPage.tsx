import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  ArrowRight,
  Lock,
  Mail,
  User,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';
import { authService } from '../services/authService.js';
import { useAuth } from '../context/AuthContext.js';
import { Button } from '../components/common/Button.js';
import { Card } from '../components/common/Card.js';
import { Footer } from '../components/common/Footer.js';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login: setAuthUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const res = await authService.register(email, password, name);
      setAuthUser(res.token, res.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
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
            <Link to="/login">
              <Button size="sm" variant="secondary">
                Log In
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
            <h1 className="text-2xl font-bold font-mono text-body tracking-tight">Create an Account</h1>
            <p className="text-xs text-muted mt-1">Start auditing your test suites with automated mutation testing</p>
          </div>

          <Card className="p-8 shadow-card border-border">
            {error && (
              <div className="mb-5 p-3 rounded-xl bg-critical/10 border border-critical/25 flex items-center gap-3 text-critical text-xs animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-body mb-1.5 font-mono">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-muted absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Soni"
                    className="w-full bg-surface-soft border border-border rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-body placeholder-muted focus:outline-none focus:border-accent transition-colors shadow-sm"
                  />
                </div>
              </div>

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
                    minLength={6}
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

              <div className="pt-1">
                <p className="text-[11px] text-muted leading-relaxed">
                  By registering, you agree to our{' '}
                  <Link to="/legal/terms" className="text-accent hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/legal/privacy" className="text-accent hover:underline">
                    Privacy Policy
                  </Link>.
                </p>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full mt-2"
                isLoading={loading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Create Account & Workspace
              </Button>
            </form>

            <div className="mt-5 pt-5 border-t border-border text-center text-xs text-muted">
              Already have an account?{' '}
              <Link to="/login" className="text-accent hover:text-accent-hover font-semibold">
                Sign in
              </Link>
            </div>
          </Card>
        </div>
      </main>

      {/* Footer at the bottom */}
      <Footer />
    </div>
  );
};
