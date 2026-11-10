import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Lock, Mail, User, AlertCircle } from 'lucide-react';
import { authService } from '../services/authService.js';
import { useAuth } from '../context/AuthContext.js';
import { Button } from '../components/common/Button.js';
import { Card } from '../components/common/Card.js';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login: setAuthUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
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
    <div className="min-h-screen bg-bg flex items-center justify-center p-6 selection:bg-accent/20 selection:text-body">
      <div className="max-w-md w-full">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-3">
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shadow-md">
              <ShieldCheck className="w-6 h-6 text-accent-text" />
            </div>
            <span className="font-bold text-2xl font-mono text-body tracking-tight">TestTruth</span>
          </Link>
          <p className="text-xs text-muted">Create your TestTruth account</p>
        </div>

        <Card className="p-8">
          {error && (
            <div className="mb-6 p-3 rounded-xl bg-critical/10 border border-critical/25 flex items-center gap-3 text-critical text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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
                  placeholder="Sarah Connor"
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
                  placeholder="sarah@cyberdyne.io"
                  className="w-full bg-surface-soft border border-border rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-body placeholder-muted focus:outline-none focus:border-accent transition-colors shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-body mb-1.5 font-mono">
                Password (min 8 chars)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-surface-soft border border-border rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-body placeholder-muted focus:outline-none focus:border-accent transition-colors shadow-sm"
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
              Create Account & Workspace
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border text-center text-xs text-muted">
            Already have an account?{' '}
            <Link to="/login" className="text-accent hover:text-accent-hover font-semibold">
              Sign in
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
