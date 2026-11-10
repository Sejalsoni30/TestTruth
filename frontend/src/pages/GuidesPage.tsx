import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, BookOpen, Clock, Tag, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Card } from '../components/common/Card.js';
import { Button } from '../components/common/Button.js';
import { Badge } from '../components/common/Badge.js';
import { Footer } from '../components/common/Footer.js';

interface Guide {
  slug: string;
  title: string;
  readingTime: string;
  tags: string[];
  summary: string;
  content: string[];
  related: string[];
}

const GUIDES_DATA: Record<string, Guide> = {
  'why-passing-tests-miss-bugs': {
    slug: 'why-passing-tests-miss-bugs',
    title: 'Why Passing Tests Can Still Miss Critical Bugs',
    readingTime: '4 min read',
    tags: ['Quality', 'Assertions', 'False Confidence'],
    summary: 'Understanding the gap between code execution and behavioral verification.',
    content: [
      'Modern automated testing suites often report 100% green while failing to protect applications against escaped production defects. The root cause is a fundamental confusion between execution and assertion.',
      'A test that invokes a business method but does not rigorously verify its postconditions will pass regardless of what the function returns. In the era of AI coding assistants, generated tests frequently check only that a promise resolves or that a value is defined (e.g. expect(res).toBeDefined()), without checking whether the calculation was correct.',
      'Mutation testing solves this by injecting inverted operators and subverted values. If a condition changes from `>= 50` to `> 50` and all tests continue to pass green, you have undeniable proof that your test suite does not verify that boundary condition.',
    ],
    related: ['how-to-replace-shallow-assertions', 'guarding-cicd-with-mutation-testing'],
  },
  'how-to-replace-shallow-assertions': {
    slug: 'how-to-replace-shallow-assertions',
    title: 'How to Replace Shallow Assertions with Invariant Checks',
    readingTime: '5 min read',
    tags: ['Best Practices', 'AST', 'Assertions'],
    summary: 'A practical refactoring guide to upgrading weak toBeTruthy and toBeDefined checks into resilient behavioral proofs.',
    content: [
      'Shallow truthiness assertions are the most common source of false test confidence. When developers assert that an object is truthy, any non-null object—including an empty error payload—satisfies the test.',
      'To build resilient suites, replace generic truthiness with exact state invariant checks. Assert specific numerical bounds, verify array lengths and item contents, and check for the exact structure of generated events.',
      'For error paths, always assert that an exception is actually thrown when invalid input is provided, rather than only testing the happy path.',
    ],
    related: ['why-passing-tests-miss-bugs', 'guarding-cicd-with-mutation-testing'],
  },
  'guarding-cicd-with-mutation-testing': {
    slug: 'guarding-cicd-with-mutation-testing',
    title: 'Guarding CI/CD Pipelines with Mutation Gates',
    readingTime: '6 min read',
    tags: ['CI/CD', 'GitHub Actions', 'Automation'],
    summary: 'How to incorporate fast incremental mutation runs into pull request reviews without slowing down team velocity.',
    content: [
      'Historically, teams avoided mutation testing in CI pipelines because running thousands of mutants across large codebases could take over an hour.',
      'TestTruth eliminates this bottleneck through SHA-256 incremental hashing. By mutating only files modified in the current pull request and reusing validated mutants for unchanged files, pull request mutation audits complete in seconds.',
      'By establishing a pull request mutation threshold (e.g., minimum 80% mutation kill rate on modified files), engineering teams prevent weak tests from entering main branches.',
    ],
    related: ['why-passing-tests-miss-bugs', 'how-to-replace-shallow-assertions'],
  },
};

export const GuidesPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  // If a specific guide slug is visited, render the full article view
  if (slug && GUIDES_DATA[slug]) {
    const guide = GUIDES_DATA[slug];
    return (
      <div className="min-h-screen bg-bg text-body flex flex-col selection:bg-accent/20 selection:text-body">
        <header className="border-b border-border bg-surface sticky top-0 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shadow-sm">
                <ShieldCheck className="w-5 h-5 text-accent-text" />
              </div>
              <span className="font-bold text-lg font-mono text-body tracking-tight">TestTruth</span>
              <span className="hidden sm:inline text-border">/</span>
              <Link to="/guides" className="hidden sm:inline font-mono text-xs font-semibold text-muted uppercase hover:text-body">Guides</Link>
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/pricing" className="text-xs text-muted hover:text-body">Pricing</Link>
              <Link to="/login"><Button size="sm" variant="primary">Launch App</Button></Link>
            </div>
          </div>
        </header>

        <div className="flex-1 max-w-4xl mx-auto px-6 py-12 w-full space-y-8">
          <Link to="/guides" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-accent font-semibold">
            <ArrowLeft className="w-4 h-4" /> Back to Guides
          </Link>

          <div className="space-y-3 pb-6 border-b border-border">
            <div className="flex flex-wrap items-center gap-2">
              {guide.tags.map((t) => (
                <Badge key={t} variant="accent" size="sm">{t}</Badge>
              ))}
              <span className="text-xs text-muted font-mono flex items-center gap-1 ml-2">
                <Clock className="w-3.5 h-3.5" /> {guide.readingTime}
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-body tracking-tight">{guide.title}</h1>
            <p className="text-sm text-muted leading-relaxed">{guide.summary}</p>
          </div>

          <Card className="p-8 space-y-6 text-sm leading-relaxed text-body">
            {guide.content.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </Card>

          {/* Related Guides */}
          <div className="space-y-3 pt-6 border-t border-border">
            <h3 className="font-mono text-xs font-bold uppercase text-muted">Related Guides:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {guide.related.map((relSlug) => {
                const rel = GUIDES_DATA[relSlug];
                if (!rel) return null;
                return (
                  <Link key={relSlug} to={`/guides/${relSlug}`}>
                    <Card className="p-4 hover:border-accent transition-colors">
                      <h4 className="font-bold text-body text-xs mb-1">{rel.title}</h4>
                      <span className="text-[11px] text-muted font-mono">{rel.readingTime}</span>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  // Default: Guides Index
  const guidesList = Object.values(GUIDES_DATA);

  return (
    <div className="min-h-screen bg-bg text-body flex flex-col selection:bg-accent/20 selection:text-body">
      <header className="border-b border-border bg-surface sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-5 h-5 text-accent-text" />
            </div>
            <span className="font-bold text-lg font-mono text-body tracking-tight">TestTruth</span>
            <span className="hidden sm:inline text-border">/</span>
            <span className="hidden sm:inline font-mono text-xs font-semibold text-muted uppercase">Guides</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/pricing" className="text-xs text-muted hover:text-body">Pricing</Link>
            <Link to="/login"><Button size="sm" variant="primary">Launch App</Button></Link>
          </div>
        </div>
      </header>

      <section className="py-16 px-6 max-w-4xl mx-auto text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border text-xs font-semibold text-accent shadow-elevation-sm">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Engineering Knowledge & Guides</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-body tracking-tight">
          Test Reliability & Mutation Guides
        </h1>
        <p className="text-xs sm:text-sm text-muted max-w-md mx-auto leading-relaxed">
          In-depth architectural guides on identifying test blindspots, strengthening assertions, and preventing escaped defects.
        </p>
      </section>

      <div className="flex-1 max-w-4xl mx-auto px-6 pb-20 w-full space-y-4">
        {guidesList.map((g) => (
          <Link key={g.slug} to={`/guides/${g.slug}`}>
            <Card className="p-6 hover:border-accent hover:shadow-elevation-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-muted flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {g.readingTime}
                  </span>
                  {g.tags.map((t) => (
                    <Badge key={t} variant="neutral" size="sm">{t}</Badge>
                  ))}
                </div>
                <h3 className="text-base font-bold text-body">{g.title}</h3>
                <p className="text-xs text-muted">{g.summary}</p>
              </div>
              <Button size="sm" variant="secondary" rightIcon={<ArrowRight className="w-3.5 h-3.5" />} className="shrink-0">
                Read Guide
              </Button>
            </Card>
          </Link>
        ))}
      </div>

      <Footer />
    </div>
  );
};

