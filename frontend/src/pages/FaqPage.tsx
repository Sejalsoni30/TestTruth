import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, HelpCircle, ChevronDown, ChevronRight, Search } from 'lucide-react';
import { Card } from '../components/common/Card.js';
import { Button } from '../components/common/Button.js';
import { Footer } from '../components/common/Footer.js';

export const FaqPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does mutation testing differ from traditional line or branch coverage?',
      a: 'Line coverage measures which lines were executed during a test run. A test that calls a function with 0 assertions achieves 100% line coverage while verifying zero behavior. Mutation testing introduces synthetic bugs (mutants) into your source code and checks whether your test suite catches them. If a test suite passes despite an altered condition, the mutant survives, revealing an unverified execution path.',
    },
    {
      q: 'What is an incremental mutation run and how does it save time?',
      a: 'Full mutation testing across an entire repository can take minutes or hours. TestTruth computes SHA-256 cryptographic hashes for every source file. On re-run or new commits, we only mutate files that changed and reuse cached results for unchanged files, delivering results in seconds.',
    },
    {
      q: 'Why does TestTruth state that it never claims a test suite is 100% reliable?',
      a: 'Our Non-Negotiable Honesty Principle dictates that no automated tool can mathematically guarantee the complete absence of bugs. Mutation kill rates show test sensitivity; surviving mutants provide evidence of blindspots, but human domain knowledge and specification design remain indispensable.',
    },
    {
      q: 'What are weak assertions and how does AST analysis detect them?',
      a: 'Using Babel AST parser, TestTruth inspects test syntax trees to flag tests that: (1) Contain zero assertions (run-only tests), (2) Only check truthiness or definition (e.g. expect(res).toBeDefined()), (3) Use tautologies like assert.equal(true, true), or (4) Call error-throwing functions without expecting an exception.',
    },
    {
      q: 'How does the execution sandbox protect uploaded code?',
      a: 'When Docker is available, tests run inside isolated containers with --network none, strict 512MB RAM limits, 1 CPU core quota, and active timeout kill switches. In environments without Docker, tests execute in sanitized Node child processes with stripped host environments.',
    },
    {
      q: 'Do you train AI models on customer code?',
      a: 'No. TestTruth maintains an absolute zero-training policy. Customer source code, test suites, and mutation findings are never used to train or fine-tune public or third-party artificial intelligence models.',
    },
  ];

  const filteredFaqs = faqs.filter(
    (f) => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())
  );

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
            <span className="hidden sm:inline font-mono text-xs font-semibold text-muted uppercase">FAQ</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/pricing" className="text-xs text-muted hover:text-body">Pricing</Link>
            <Link to="/login"><Button size="sm" variant="primary">Launch App</Button></Link>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <section className="py-16 px-6 max-w-4xl mx-auto text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border text-xs font-semibold text-accent shadow-elevation-sm">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Frequently Asked Questions</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-body tracking-tight">
          Everything You Need to Know About TestTruth
        </h1>
        <p className="text-xs sm:text-sm text-muted max-w-lg mx-auto leading-relaxed">
          Questions about mutation kill rates, sandbox security, incremental runs, and our non-negotiable honesty standards.
        </p>

        {/* Search Bar */}
        <div className="pt-4 max-w-md mx-auto relative">
          <Search className="w-4 h-4 text-muted absolute left-3.5 top-6 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions (e.g. sandbox, kill rate, coverage)..."
            className="w-full bg-surface border border-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-body focus:outline-none focus:border-accent shadow-elevation-sm"
          />
        </div>
      </section>

      {/* Accordion List */}
      <div className="flex-1 max-w-3xl mx-auto px-6 pb-20 w-full space-y-3 text-xs">
        {filteredFaqs.length === 0 ? (
          <Card className="p-8 text-center text-muted">
            No questions match "{search}". Try searching for "coverage", "sandbox", or "mutant".
          </Card>
        ) : (
          filteredFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <Card
                key={index}
                className="overflow-hidden cursor-pointer transition-all border border-border hover:border-accent/40"
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <div className="p-4 flex items-center justify-between gap-3 bg-surface">
                  <h3 className="font-semibold text-body text-xs sm:text-sm">{faq.q}</h3>
                  <button className="text-muted shrink-0">
                    {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                </div>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-muted text-xs leading-relaxed border-t border-border bg-surface-soft/40">
                    {faq.a}
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>

      <Footer />
    </div>
  );
};

