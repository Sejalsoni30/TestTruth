import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, Send, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';
import { Card } from '../components/common/Card.js';
import { Button } from '../components/common/Button.js';
import { Footer } from '../components/common/Footer.js';
import { request } from '../services/api.js';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await request<{ success: boolean; message: string }>('/contact', {
        method: 'POST',
        body: JSON.stringify({ name, email, subject, message }),
      });

      setSuccessMessage(res.message);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit contact message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
            <span className="hidden sm:inline font-mono text-xs font-semibold text-muted uppercase">Contact</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/pricing" className="text-xs text-muted hover:text-body">Pricing</Link>
            <Link to="/login"><Button size="sm" variant="primary">Launch App</Button></Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-3xl mx-auto px-6 py-16 w-full space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border text-xs font-semibold text-accent shadow-elevation-sm">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Direct Architecture & Support Inquiries</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-body tracking-tight">
            Contact the TestTruth Engineering Team
          </h1>
          <p className="text-xs sm:text-sm text-muted max-w-xl mx-auto leading-relaxed">
            Have questions about mutation testing operators, enterprise on-prem sandbox deployments, or custom CI/CD pipelines? Send our engineers a direct message.
          </p>
        </div>

        <Card className="p-8">
          {successMessage && (
            <div className="mb-6 p-4 rounded-xl bg-low/15 border border-low/30 text-low text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Message Successfully Recorded:</span>
                <p className="mt-0.5 leading-relaxed">{successMessage}</p>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-critical/15 border border-critical/30 text-critical text-xs flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-body font-semibold mb-1 uppercase text-[10px]">Your Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Rivera"
                  className="w-full bg-surface-soft border border-border rounded-xl px-3.5 py-2.5 text-body focus:outline-none focus:border-accent text-xs"
                />
              </div>

              <div>
                <label className="block text-body font-semibold mb-1 uppercase text-[10px]">Work Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="engineer@company.com"
                  className="w-full bg-surface-soft border border-border rounded-xl px-3.5 py-2.5 text-body focus:outline-none focus:border-accent text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-body font-semibold mb-1 uppercase text-[10px]">Subject *</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enterprise VPC Sandbox Question"
                className="w-full bg-surface-soft border border-border rounded-xl px-3.5 py-2.5 text-body focus:outline-none focus:border-accent text-xs"
              />
            </div>

            <div>
              <label className="block text-body font-semibold mb-1 uppercase text-[10px]">Message *</label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your test suite architecture, language support questions, or team requirements..."
                className="w-full bg-surface-soft border border-border rounded-xl px-3.5 py-2.5 text-body focus:outline-none focus:border-accent text-xs"
              />
            </div>

            <Button
              type="submit"
              size="md"
              variant="primary"
              isLoading={loading}
              className="w-full justify-center text-xs mt-2"
              rightIcon={<Send className="w-3.5 h-3.5" />}
            >
              Send Message to Architecture Team
            </Button>
          </form>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

