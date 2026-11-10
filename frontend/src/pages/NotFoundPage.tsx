import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { Button } from '../components/common/Button.js';
import { Footer } from '../components/common/Footer.js';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-bg text-body flex flex-col justify-between selection:bg-accent/20 selection:text-body">
      <header className="border-b border-border bg-surface px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-bold text-lg font-mono text-body tracking-tight">TestTruth</Link>
      </header>

      <div className="max-w-md mx-auto text-center p-8 space-y-4 my-auto">
        <div className="w-14 h-14 rounded-full bg-critical/15 text-critical flex items-center justify-center mx-auto mb-2">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h1 className="text-4xl font-extrabold font-mono text-body">404</h1>
        <h2 className="text-base font-bold text-body">Page Not Found</h2>
        <p className="text-xs text-muted leading-relaxed">
          The requested route does not exist or has moved. Return to the home page or access the project workspace.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link to="/">
            <Button size="sm" variant="primary" leftIcon={<Home className="w-4 h-4" />}>
              Back to Home
            </Button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};
