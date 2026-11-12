import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Terminal,
  Code2,
  Dna,
  Zap,
} from 'lucide-react';
import { Badge } from '../common/Badge.js';
import { Button } from '../common/Button.js';

interface Scenario {
  id: string;
  name: string;
  category: string;
  file: string;
  line: number;
  originalCode: string;
  mutatedCode: string;
  initialStatus: 'survived' | 'killed' | 'weak';
  initialStatusText: string;
  terminalLogs: string[];
  explanation: string;
  suggestedFixTest: string;
  fixedStatusText: string;
}

const scenarios: Scenario[] = [
  {
    id: 'boundary',
    name: 'Boundary Inversion',
    category: 'Relational Operator',
    file: 'src/billing/tierPricing.ts',
    line: 18,
    originalCode: 'if (userCount >= 50) return tierDiscount;',
    mutatedCode: 'if (userCount > 50) return tierDiscount;',
    initialStatus: 'survived',
    initialStatusText: 'SURVIVED (Defect Escaped)',
    terminalLogs: [
      '[sandbox:docker] Initializing isolated runtime (memory: 256MB, network: blocked)...',
      '[sandbox:docker] Injecting relational mutant at tierPricing.ts:18 (>= -> >)...',
      '[sandbox:jest] Running test/tierPricing.test.ts (2 tests)...',
      '  PASS test/tierPricing.test.ts (users: 10, users: 55)',
      '[analyzer] ALERT: Test passed despite inverted boundary condition at userCount = 50.',
      '[verdict] Mutant survived. Test suite lacks boundary evaluation at exact threshold.',
    ],
    explanation:
      'The original code grants discount at >= 50. The mutated code requires > 50. Existing unit tests only evaluate 10 and 55 users; no test checks exactly 50. The mutant survives 100% green!',
    suggestedFixTest: `// AI-Generated Boundary Test (Reproduction & Verification)
test("tier discount is awarded at exact threshold (50 users)", () => {
  const result = calculateTierPricing({ userCount: 50 });
  expect(result.hasDiscount).toBe(true);
  expect(result.discountPercentage).toBe(0.15);
});`,
    fixedStatusText: 'KILLED (Caught at line 18)',
  },
  {
    id: 'condition',
    name: 'Condition Negation',
    category: 'Logical Operator',
    file: 'src/services/refundValidator.ts',
    line: 34,
    originalCode: 'if (order.isSettled && !order.isDisputed)',
    mutatedCode: 'if (order.isSettled && order.isDisputed)',
    initialStatus: 'killed',
    initialStatusText: 'KILLED (Bug Caught)',
    terminalLogs: [
      '[sandbox:docker] Initializing isolated runtime (memory: 256MB, network: blocked)...',
      '[sandbox:docker] Mutating logic condition at refundValidator.ts:34 (!order.isDisputed -> order.isDisputed)...',
      '[sandbox:jest] Running test/refundValidator.test.ts (4 tests)...',
      '  FAIL test/refundValidator.test.ts',
      '    ✕ should deny refund if order is in dispute (AssertionError: expected false, received true)',
      '[verdict] Mutant killed by assertion at line 42. Test correctly caught inverted boolean.',
    ],
    explanation:
      'The inverted boolean caused the test "should deny refund if order is in dispute" to trigger an AssertionError and fail the test. The mutation was successfully killed.',
    suggestedFixTest: `// Existing test adequately asserts this condition:
expect(refundResult.isApproved).toBe(false);`,
    fixedStatusText: 'KILLED (Strong Assertion Present)',
  },
  {
    id: 'zero-assert',
    name: 'Run-Only Test (AST Blindspot)',
    category: 'Assertion Audit',
    file: 'test/auth/tokenVerification.test.ts',
    line: 12,
    originalCode: 'await verifyToken(sampleExpiredJwt);',
    mutatedCode: '/* Function runs, but ZERO expect() calls exist */',
    initialStatus: 'weak',
    initialStatusText: 'WEAK TEST (0 Assertions)',
    terminalLogs: [
      '[analyzer:ast] Parsing test AST tree with Babel parser...',
      '[analyzer:ast] Scanning CallExpression nodes in "test/auth/tokenVerification.test.ts"...',
      '[analyzer:ast] Found test("verifies expired token"). Total assertions: 0.',
      '[analyzer:ast] Function execution alone does not verify returned claims or error state.',
      '[verdict] False confidence: test reports PASS while verifying zero invariants.',
    ],
    explanation:
      'This test executes the function but asserts nothing. Even if verifyToken returns null, corrupted payload, or grants admin privileges to expired tokens, the test suite reports 100% PASS.',
    suggestedFixTest: `// AI-Generated Assertion Fix
test("rejects expired token with unauthorized exception", async () => {
  await expect(verifyToken(sampleExpiredJwt)).rejects.toThrow("TokenExpiredError");
});`,
    fixedStatusText: 'HARDENED (Rigorous Expect Clause)',
  },
  {
    id: 'arithmetic',
    name: 'Arithmetic Inversion',
    category: 'Math Expression',
    file: 'src/checkout/taxCalculation.ts',
    line: 22,
    originalCode: 'return subtotal + taxAmount;',
    mutatedCode: 'return subtotal - taxAmount;',
    initialStatus: 'survived',
    initialStatusText: 'SURVIVED (Zero-Tax Mock Mockup)',
    terminalLogs: [
      '[sandbox:docker] Injecting arithmetic mutant at taxCalculation.ts:22 (+ -> -)...',
      '[sandbox:jest] Running test/taxCalculation.test.ts...',
      '  PASS test/taxCalculation.test.ts (taxAmount = 0 in mock fixture)',
      '[analyzer] ALERT: Mutated calculation produced identical output because taxAmount was 0.',
      '[verdict] Mutant survived due to degenerate mock fixture values.',
    ],
    explanation:
      'The mock test fixture supplied taxAmount = 0, so subtotal + 0 equals subtotal - 0. The test suite passed, disguising an inverted sign that would fail in real production billing!',
    suggestedFixTest: `// AI-Generated Non-Degenerate Test Fixture
test("accurately computes invoice total with non-zero tax", () => {
  const invoice = computeTotal({ subtotal: 100, taxAmount: 18 });
  expect(invoice.total).toBe(118); // Subtraction would yield 82 and fail
});`,
    fixedStatusText: 'KILLED (Non-Zero Fixture Verified)',
  },
];

export const InteractiveMutantSimulator: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(scenarios[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(100);
  const [isFixed, setIsFixed] = useState(false);
  const [logIndex, setLogIndex] = useState(scenarios[0].terminalLogs.length);

  const handleSelectScenario = (sc: Scenario) => {
    setSelectedScenario(sc);
    setIsFixed(false);
    setProgress(100);
    setLogIndex(sc.terminalLogs.length);
  };

  const handleRunSimulation = () => {
    setIsRunning(true);
    setProgress(0);
    setLogIndex(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          setLogIndex(selectedScenario.terminalLogs.length);
          return 100;
        }
        return prev + 25;
      });
      setLogIndex((idx) => Math.min(idx + 1, selectedScenario.terminalLogs.length));
    }, 300);
  };

  const handleApplyFix = () => {
    setIsRunning(true);
    setProgress(0);
    setTimeout(() => {
      setProgress(100);
      setIsRunning(false);
      setIsFixed(true);
    }, 700);
  };

  const currentStatus = isFixed
    ? 'killed'
    : selectedScenario.initialStatus;

  const currentStatusText = isFixed
    ? selectedScenario.fixedStatusText
    : selectedScenario.initialStatusText;

  return (
    <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8 shadow-card">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-accent/10 text-accent border border-accent/20">
              <Zap className="w-3 h-3 fill-current" /> Interactive Sandbox Simulator
            </span>
            <span className="text-xs font-mono text-muted">Test suite sensitivity in action</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-body tracking-tight">
            Live Mutation & AST Sandbox Simulator
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            onClick={() => {
              setIsFixed(false);
              handleRunSimulation();
            }}
            disabled={isRunning}
          >
            Reset
          </Button>
          <Button
            size="sm"
            variant="primary"
            leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
            onClick={handleRunSimulation}
            isLoading={isRunning}
          >
            Run Sandbox
          </Button>
        </div>
      </div>

      {/* Scenario Selector Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-6">
        {scenarios.map((sc) => {
          const isActive = selectedScenario.id === sc.id;
          return (
            <motion.button
              key={sc.id}
              onClick={() => handleSelectScenario(sc)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-3 rounded-xl text-left border transition-all relative ${
                isActive
                  ? 'bg-surface-soft border-accent shadow-sm'
                  : 'bg-surface border-border hover:border-border-secondary hover:bg-surface-soft/40'
              }`}
            >
              <div className="text-[10px] font-mono text-muted uppercase tracking-wider mb-1">
                {sc.category}
              </div>
              <div className="text-xs font-bold text-body truncate">{sc.name}</div>
              {isActive && (
                <motion.div
                  layoutId="activePill"
                  className="absolute bottom-0 left-3 right-3 h-0.5 bg-accent rounded-full"
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Progress Bar (Visible during simulation run) */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-mono text-muted mb-1.5">
          <span>Sandbox Pipeline Progress:</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 w-full bg-surface-soft rounded-full overflow-hidden border border-border">
          <motion.div
            className="h-full bg-accent"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Main Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Code Diff & Mutated Inspection */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 rounded-2xl bg-surface-soft/60 border border-border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-accent" />
                <span className="text-xs font-mono font-bold text-body">
                  {selectedScenario.file}:{selectedScenario.line}
                </span>
              </div>
              <Badge variant={currentStatus}>
                {currentStatusText}
              </Badge>
            </div>

            {/* Original vs Mutated Code Box */}
            <div className="space-y-3 font-mono text-xs">
              <div>
                <span className="text-[10px] uppercase text-muted font-bold tracking-wider">
                  Original Source (Production Code):
                </span>
                <pre className="mt-1 p-3 rounded-xl bg-code-bg text-code-text border border-border overflow-x-auto">
                  <code>{selectedScenario.originalCode}</code>
                </pre>
              </div>

              <div>
                <span className="text-[10px] uppercase text-critical font-bold tracking-wider flex items-center gap-1">
                  <Dna className="w-3.5 h-3.5" /> Synthetically Injected Mutation (Deliberate Defect):
                </span>
                <pre className="mt-1 p-3 rounded-xl bg-code-bg text-critical border border-critical/30 overflow-x-auto">
                  <code>{selectedScenario.mutatedCode}</code>
                </pre>
              </div>
            </div>

            {/* Explanation card */}
            <div className="mt-4 p-3.5 rounded-xl bg-surface border border-border">
              <h5 className="text-xs font-bold text-body mb-1 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-medium" /> Why standard testing missed this:
              </h5>
              <p className="text-xs text-muted leading-relaxed">
                {selectedScenario.explanation}
              </p>
            </div>
          </div>

          {/* AI-Suggested Test Fix Card */}
          <div className="p-4 rounded-2xl bg-surface-soft/40 border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-accent font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 fill-current" /> AI-Generated Test Assertion Fix
              </span>
              {!isFixed && selectedScenario.initialStatus !== 'killed' && (
                <Button
                  size="sm"
                  variant="primary"
                  onClick={handleApplyFix}
                  isLoading={isRunning}
                  leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                >
                  Verify Fix (Re-run Mutant)
                </Button>
              )}
            </div>

            <pre className="p-3 rounded-xl bg-code-bg text-emerald-400 text-xs font-mono border border-emerald-500/20 overflow-x-auto">
              <code>{selectedScenario.suggestedFixTest}</code>
            </pre>

            {isFixed && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 p-2.5 rounded-xl bg-low/10 border border-low/20 text-low text-xs flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span className="font-semibold">
                  Fix Verified: Added assertion caught the defect. Mutant now KILLED with zero escapes!
                </span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Live Terminal Output */}
        <div className="lg:col-span-5">
          <div className="h-full rounded-2xl bg-code-bg border border-border p-4 flex flex-col font-mono text-[11px] text-code-text shadow-inner">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-accent" />
                <span className="font-bold text-white text-xs">Sandbox Execution Log</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-critical/80 inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-medium/80 inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-low/80 inline-block"></span>
              </div>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto leading-relaxed max-h-[380px] pr-1">
              {selectedScenario.terminalLogs.slice(0, logIndex).map((log, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15 }}
                  className={
                    log.includes('FAIL') || log.includes('ALERT')
                      ? 'text-critical'
                      : log.includes('KILLED') || log.includes('PASS')
                      ? 'text-emerald-400'
                      : log.includes('WARM') || log.includes('weak')
                      ? 'text-amber-300'
                      : 'text-sidebar-muted'
                  }
                >
                  {log}
                </motion.div>
              ))}

              {isFixed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-emerald-400 font-bold pt-2 border-t border-white/10"
                >
                  ✓ RE-RUN COMPLETE: 1 mutant tested, 1 mutant killed (100% kill rate).
                </motion.div>
              )}

              {isRunning && (
                <div className="flex items-center gap-2 text-accent animate-pulse pt-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-accent animate-ping" />
                  <span>Executing sandbox verification pipeline...</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-white/10 text-[10px] text-sidebar-muted flex items-center justify-between">
              <span>Environment: Linux x86_64</span>
              <span>Network: Disconnected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

