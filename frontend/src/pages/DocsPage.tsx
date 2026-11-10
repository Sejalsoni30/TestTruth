import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  BookOpen,
  Search,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Code2,
  FileCode,
} from 'lucide-react';
import { Card } from '../components/common/Card.js';
import { Button } from '../components/common/Button.js';
import { Badge } from '../components/common/Badge.js';
import { Footer } from '../components/common/Footer.js';
import { DOCS_ARTICLES, DocArticle } from '../content/docsContent.js';

export const DocsPage: React.FC = () => {
  const { slug = 'getting-started' } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const currentArticle: DocArticle = DOCS_ARTICLES[slug] || DOCS_ARTICLES['getting-started'];
  const allArticles = Object.values(DOCS_ARTICLES);

  const filteredArticles = allArticles.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase())
  );

  // Group by category
  const categories: Record<string, DocArticle[]> = {};
  filteredArticles.forEach((art) => {
    if (!categories[art.category]) categories[art.category] = [];
    categories[art.category].push(art);
  });

  // Calculate prev/next
  const currentIndex = allArticles.findIndex((a) => a.slug === currentArticle.slug);
  const prevArticle = currentIndex > 0 ? allArticles[currentIndex - 1] : null;
  const nextArticle = currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null;

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
            <span className="hidden sm:inline font-mono text-xs font-semibold text-muted uppercase">Documentation</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/pricing" className="text-xs text-muted hover:text-body">Pricing</Link>
            <Link to="/login"><Button size="sm" variant="primary">Launch App</Button></Link>
          </div>
        </div>
      </header>

      {/* Docs Body Layout */}
      <div className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar: Navigation & Search (3 cols) */}
        <div className="lg:col-span-3 lg:sticky lg:top-24 space-y-4 text-xs font-sans">
          <div className="relative">
            <Search className="w-4 h-4 text-muted absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search docs..."
              className="w-full bg-surface border border-border rounded-xl pl-9 pr-3.5 py-2 text-xs text-body focus:outline-none focus:border-accent shadow-sm"
            />
          </div>

          <div className="space-y-4 max-h-[calc(100vh-180px)] overflow-y-auto pr-1">
            {Object.entries(categories).map(([catName, articles]) => (
              <div key={catName} className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase font-bold text-muted tracking-wider block px-2">
                  {catName}
                </span>
                <div className="space-y-0.5">
                  {articles.map((art) => {
                    const isSelected = art.slug === currentArticle.slug;
                    return (
                      <Link
                        key={art.slug}
                        to={`/docs/${art.slug}`}
                        className={`block px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-accent text-accent-text font-semibold shadow-sm'
                            : 'text-muted hover:text-body hover:bg-surface-soft'
                        }`}
                      >
                        {art.title}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center: Main Article Content (6 cols) */}
        <div className="lg:col-span-6 space-y-6 text-xs leading-relaxed">
          <div className="space-y-2 pb-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Badge variant="accent">{currentArticle.category}</Badge>
              <span className="text-muted font-mono text-[11px]">docs/{currentArticle.slug}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-body tracking-tight">
              {currentArticle.title}
            </h1>
            <p className="text-sm text-muted leading-relaxed">{currentArticle.description}</p>
          </div>

          <div className="space-y-8">
            {currentArticle.body.map((section, idx) => (
              <Card key={idx} id={section.headingId} className="p-6 space-y-3">
                {section.subheading && (
                  <h2 className="text-base font-bold text-body tracking-tight pb-2 border-b border-border">
                    {section.subheading}
                  </h2>
                )}
                <p className="text-body leading-relaxed">{section.text}</p>
                {section.codeSnippet && (
                  <pre className="p-3.5 bg-code-bg text-code-text rounded-xl font-mono text-[11px] overflow-x-auto border border-border">
                    {section.codeSnippet}
                  </pre>
                )}
                {section.note && (
                  <div className="p-3 bg-surface-soft rounded-lg text-muted border border-border">
                    {section.note}
                  </div>
                )}
              </Card>
            ))}
          </div>

          {/* Prev / Next Pagination */}
          <div className="pt-6 border-t border-border flex items-center justify-between gap-4 font-mono text-xs">
            {prevArticle ? (
              <Link
                to={`/docs/${prevArticle.slug}`}
                className="flex items-center gap-1.5 text-muted hover:text-accent font-semibold p-2 rounded-lg hover:bg-surface-soft transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Prev: {prevArticle.title}</span>
              </Link>
            ) : <div />}

            {nextArticle && (
              <Link
                to={`/docs/${nextArticle.slug}`}
                className="flex items-center gap-1.5 text-muted hover:text-accent font-semibold p-2 rounded-lg hover:bg-surface-soft transition-colors ml-auto"
              >
                <span>Next: {nextArticle.title}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>

        {/* Right Sidebar: "On this page" list (3 cols) */}
        <div className="lg:col-span-3 lg:sticky lg:top-24 hidden lg:block space-y-3 text-xs">
          <Card className="p-4">
            <span className="font-mono text-[10px] uppercase font-bold text-body block mb-2 pb-1 border-b border-border">
              On this page
            </span>
            <ul className="space-y-1.5 text-muted font-medium">
              {currentArticle.headings.map((h) => (
                <li key={h.id}>
                  <a
                    href={`#${h.id}`}
                    className="hover:text-accent transition-colors block py-0.5 truncate"
                  >
                    • {h.title}
                  </a>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

