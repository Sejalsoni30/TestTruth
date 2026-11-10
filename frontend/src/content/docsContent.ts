export interface DocArticle {
  slug: string;
  title: string;
  category: string;
  description: string;
  headings: Array<{ id: string; title: string }>;
  body: Array<{
    headingId?: string;
    subheading?: string;
    text: string;
    codeSnippet?: string;
    note?: string;
  }>;
}

export const DOCS_ARTICLES: Record<string, DocArticle> = {
  'getting-started': {
    slug: 'getting-started',
    title: 'Getting Started with TestTruth',
    category: 'Fundamentals',
    description: 'Learn how to set up your account, initialize your first project workspace, and audit test reliability.',
    headings: [
      { id: 'overview', title: 'Platform Overview' },
      { id: 'quickstart', title: 'Quickstart Guide' },
      { id: 'honesty-principles', title: 'Scientific Honesty Standards' },
    ],
    body: [
      {
        headingId: 'overview',
        subheading: 'Platform Overview',
        text: 'TestTruth is an automated reliability audit engine designed to answer one critical question: Your tests pass, but are they actually catching bugs? By injecting synthetic mutations and parsing AST assertion patterns, we find tests that provide false confidence.',
      },
      {
        headingId: 'quickstart',
        subheading: 'Quickstart Guide',
        text: 'To begin auditing, register an account or click Launch Demo Workspace. From the Project Workspace, upload a ZIP archive of your JavaScript or TypeScript codebase containing a package.json and a test suite.',
        codeSnippet: '# Supported test frameworks:\n# - Jest (test/**/*.test.js)\n# - Vitest (tests/**/*.spec.ts)\n# - Node Native Runner (node --test)',
      },
      {
        headingId: 'honesty-principles',
        subheading: 'Scientific Honesty Standards',
        text: 'Never claim a test suite is 100% bug-free. TestTruth delivers measurable sensitivity scores, reproducible unified diffs, and clear disclosures of automated testing limits.',
      },
    ],
  },
  'upload-a-project': {
    slug: 'upload-a-project',
    title: 'Uploading Projects & Test Suites',
    category: 'Workspaces',
    description: 'Guidelines for bundling code, ZIP-slip protection, and file structure requirements.',
    headings: [
      { id: 'supported-archives', title: 'Supported Formats' },
      { id: 'security-protection', title: 'Zip-Slip & Path Traversal Security' },
    ],
    body: [
      {
        headingId: 'supported-archives',
        subheading: 'Supported Formats',
        text: 'Upload your project as a .zip file or select individual .js and .ts source and test files. TestTruth automatically filters out node_modules and hidden cache directories, indexing only valid source and test files.',
      },
      {
        headingId: 'security-protection',
        subheading: 'Zip-Slip & Path Traversal Security',
        text: 'All ZIP entries are rigorously validated against directory traversal attacks. Entries attempting to extract outside the sterile sandbox folder are immediately rejected with an error.',
      },
    ],
  },
  'reading-findings': {
    slug: 'reading-findings',
    title: 'Interpreting AST Reliability Findings',
    category: 'Analysis Engine',
    description: 'Understanding weak assertions, run-only tests, tautologies, and confidence ratings.',
    headings: [
      { id: 'ast-rules', title: 'AST Rule Standards' },
      { id: 'confidence-ratings', title: 'Confidence Scoring' },
    ],
    body: [
      {
        headingId: 'ast-rules',
        subheading: 'AST Rule Standards',
        text: 'TestTruth flags four core static test weaknesses: TEST-NO-ASSERTION (run-only tests containing zero assertions), TEST-SHALLOW-TRUTHINESS (asserting only toBeDefined), TEST-TAUTOLOGY (asserting true === true), and TEST-MISSING-EXCEPTION (unasserted error paths).',
      },
      {
        headingId: 'confidence-ratings',
        subheading: 'Confidence Scoring',
        text: 'Findings are weighted with confidence scores (e.g. 95% High Confidence for 0-assertion tests), ensuring engineers prioritize critical postcondition gaps.',
      },
    ],
  },
  'mutation-testing-explained': {
    slug: 'mutation-testing-explained',
    title: 'Mutation Testing Explained',
    category: 'Mutation Testing',
    description: 'How synthetic fault injection exposes test suites that pass without proving anything.',
    headings: [
      { id: 'what-is-mutation', title: 'What is Mutation Testing?' },
      { id: 'killed-vs-survived', title: 'Killed vs. Survived Mutants' },
    ],
    body: [
      {
        headingId: 'what-is-mutation',
        subheading: 'What is Mutation Testing?',
        text: 'Mutation testing introduces small synthetic bugs (mutants) into your application source code—such as changing >= to >, or + to -—and executes your existing test suite against the mutant.',
      },
      {
        headingId: 'killed-vs-survived',
        subheading: 'Killed vs. Survived Mutants',
        text: 'If your tests fail when a bug is injected, the mutant is KILLED (a sign of sensitive tests). If your tests still report green, the mutant SURVIVED, providing empirical proof of an untested boundary.',
      },
    ],
  },
  'scoring-formula-and-limits': {
    slug: 'scoring-formula-and-limits',
    title: 'Scoring Formula & Limitations',
    category: 'Methodology',
    description: 'Mathematical definitions, mutation kill rate formula, and equivalent mutant caveats.',
    headings: [
      { id: 'formula', title: 'Kill Rate Formula' },
      { id: 'limitations', title: 'Inherent Limitations' },
    ],
    body: [
      {
        headingId: 'formula',
        subheading: 'Kill Rate Formula',
        text: 'Mutation Kill Rate (%) = (Killed Mutants / Total Generated Mutants) * 100. This metric directly tracks test suite sensitivity to code edits.',
        codeSnippet: 'Kill Rate = (Killed / (Killed + Survived + TimedOut)) * 100',
      },
      {
        headingId: 'limitations',
        subheading: 'Inherent Limitations',
        text: 'Surviving mutants are evidence of possible weakness, not proof of a bug. Some mutants are semantically equivalent to the original code and cannot be killed by any valid test.',
      },
    ],
  },
  'ai-configuration': {
    slug: 'ai-configuration',
    title: 'AI Provider Configuration',
    category: 'Configuration',
    description: 'Configuring optional LLM keys for AI-assisted test fix generation.',
    headings: [
      { id: 'provider-agnostic', title: 'Provider-Agnostic LLM Layer' },
      { id: 'zero-retention', title: 'Zero Data Retention' },
    ],
    body: [
      {
        headingId: 'provider-agnostic',
        subheading: 'Provider-Agnostic LLM Layer',
        text: 'TestTruth is provider-agnostic. Configure your API key via environment variables (GEMINI_API_KEY, OPENAI_API_KEY, or ANTHROPIC_API_KEY). If no key is set, TestTruth clearly notes that AI features are disabled while running deterministic mutation tests at 100% capacity.',
      },
      {
        headingId: 'zero-retention',
        subheading: 'Zero Data Retention',
        text: 'Snippets sent for test synthesis are processed in memory and never stored for model training.',
      },
    ],
  },
  'troubleshooting-docker': {
    slug: 'troubleshooting-docker',
    title: 'Troubleshooting Docker Sandboxes',
    category: 'Security & Sandboxing',
    description: 'Understanding container requirements, process sandbox fallbacks, and execution limits.',
    headings: [
      { id: 'docker-detection', title: 'Docker Availability Check' },
      { id: 'fallback-sandbox', title: 'Process Sandbox Fallback' },
    ],
    body: [
      {
        headingId: 'docker-detection',
        subheading: 'Docker Availability Check',
        text: 'TestTruth queries docker --version on startup. If Docker is available, containers run with --network none, memory caps, and non-root users.',
      },
      {
        headingId: 'fallback-sandbox',
        subheading: 'Process Sandbox Fallback',
        text: 'If Docker is absent, TestTruth falls back to an isolated Node child process with sanitized environment variables and execution watchdogs, displaying an honest notice in the UI.',
      },
    ],
  },
};

