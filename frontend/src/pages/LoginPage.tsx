import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Lock, Mail, AlertCircle } from 'lucide-react';
import { authService } from '../services/authService.js';
import { useAuth } from '../context/AuthContext.js';
import { Button } from '../components/common/Button.js';
import { Card } from '../components/common/Card.js';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login: setAuthUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await authService.login(email, password);
      setAuthUser(res.token, res.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen app-bg flex items-center justify-center p-6 relative selection:bg-accent/30 selection:text-body">
      <div className="fixed inset-0 spotlight-overlay z-0 pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-b from-mauve-200 to-mauve-400 flex items-center justify-center shadow-elevation-md">
              <ShieldCheck className="w-6 h-6 text-mauve-950" />
            </div>
            <span className="font-bold text-2xl font-mono text-body tracking-tight">TestTruth</span>
          </Link>
          <p className="text-xs text-muted">Sign in to audit and verify your test suites</p>
        </div>

        <Card className="p-8">
          {error && (
            <div className="mb-6 p-3 rounded-xl bg-critical/15 border border-critical/30 flex items-center gap-3 text-critical text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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
                  placeholder="engineer@company.com"
                  className="w-full bg-bg/80 border border-border rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-body placeholder-muted/60 focus:outline-none focus:border-accent transition-colors shadow-elevation-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-body mb-1.5 font-mono">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-bg/80 border border-border rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-body placeholder-muted/60 focus:outline-none focus:border-accent transition-colors shadow-elevation-sm"
                />
              </div>
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

          <div className="mt-6 pt-6 border-t border-border text-center text-xs text-muted">
            Don't have an account?{' '}
            <Link to="/register" className="text-accent hover:text-body font-semibold">
              Create an account
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
