# TestTruth

> *"Your tests pass. But are they actually catching bugs?"*

TestTruth audits the reliability of a test suite. It finds tests that pass without proving anything using mutation testing, assertion analysis, and AI-assisted scenario generation, and it backs every finding with reproducible evidence.

---

## 1. The Problem
AI coding assistants now write tests that go green but miss real bugs. Some tests only check that code runs (run-only tests). Some lock in faulty behavior. Some have weak assertions (`expect(true).toBe(true)` or `toBeDefined()`). Teams ship with false confidence.

TestTruth challenges test suites, detects false confidence, and provides verifiable evidence of how reliably tests identify defects.

---

## 2. Architecture & Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS (Dark Navy & Charcoal theme), Recharts, Lucide icons.
- **Backend:** Node.js, Express, TypeScript, REST API, Zod schema validation, Helmet, Zip-slip secure uploads.
- **Analysis Engine:** Python 3.12, FastAPI, Tree-sitter AST parsers for JS/TS, Mutation Testing runner.
- **Database:** MongoDB with Mongoose (with automated `mongodb-memory-server` fallback for zero-friction local development).
- **Execution:** Isolated sandboxes with strict memory limits, CPU quotas, and timeout kill switches.
- **AI Layer:** Provider-agnostic LLM adapter (Gemini, OpenAI, Anthropic, Ollama) with a static **Deterministic Engine** fallback.

---

## 3. Non-Negotiable Honesty Principle
- Never claim a test suite is "fully reliable".
- Always present measurable evidence, limitations, and uncertainty.
- Strict finding classifications:
  - **Verified Mismatch**
  - **Surviving Mutation**
  - **Weak Assertion**
  - **Missing Scenario**
  - **Inconclusive**
- No single blended vanity "reliability %" without full formula and limitation disclosures.

---

## 4. Quick Start & Local Development

### Prerequisites
- Node.js >= 20.x
- Python >= 3.10
- npm >= 10.x

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Sejalsoni30/TestTruth.git
   cd TestTruth
   ```

2. **Install Backend Dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Configuration:**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

### Running Locally

- **Start Backend API:**
  ```bash
  cd backend
  npm run dev
  # API runs on http://localhost:5000
  # Automatically connects to external MongoDB or starts in-memory MongoDB
  ```

- **Start Frontend UI:**
  ```bash
  cd frontend
  npm run dev
  # Web application runs on http://localhost:3000
  ```

- **Run E2E Foundation Verification:**
  ```bash
  cd backend
  npx tsx src/e2e_phase2_gate.ts
  ```

---

## 5. Security Model
- **Zip-Slip Mitigation:** Strict path normalization rejecting any entries resolving outside extraction boundaries or containing `..`.
- **Sandbox Isolation:** Untrusted test execution runs with sterile environment variables (zero host secrets/LLM keys leaked), CPU/RAM limits, and hard timeout watchdogs.
- **Strict Classification:** Findings are backed by AST inspection, counterexamples, and mutant diffs.

---

## 6. License
MIT License. Built for engineering teams and researchers studying software test reliability.
