import * as parser from '@babel/parser';
import _traverse from '@babel/traverse';
import mongoose from 'mongoose';

// Handle CommonJS / ESM default export differences for @babel/traverse
const traverse = (_traverse as any).default || _traverse;

export interface RawFinding {
  classification:
    | 'Verified mismatch'
    | 'Surviving mutation'
    | 'Weak assertion'
    | 'Missing scenario'
    | 'Inconclusive';
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  title: string;
  filePath: string;
  line: number;
  column?: number;
  whyUnreliable: string;
  suggestedFix: string;
  confidence: 'high' | 'medium' | 'low';
  confidenceScore: number;
  evidence: {
    snippet?: string;
    actualAssertion?: string;
    details?: string;
  };
  ruleId: string;
}

export function analyzeTestFile(
  filePath: string,
  content: string,
  sourceFiles: Array<{ relativePath: string; content: string }>
): RawFinding[] {
  const findings: RawFinding[] = [];
  const lines = content.split('\n');

  let ast: any;
  try {
    ast = parser.parse(content, {
      sourceType: 'unambiguous',
      plugins: ['jsx', 'typescript'],
    });
  } catch (err) {
    // If Babel parser fails, perform regex-based fallback
    return analyzeWithRegexFallback(filePath, content, lines);
  }

  // Check each test/it block
  traverse(ast, {
    CallExpression(path: any) {
      const callee = path.node.callee;
      const isTestCall =
        (callee.type === 'Identifier' && (callee.name === 'test' || callee.name === 'it')) ||
        (callee.type === 'MemberExpression' &&
          callee.object.name === 'test' &&
          callee.property.name === 'it');

      if (!isTestCall) return;

      const testNameNode = path.node.arguments[0];
      const testName =
        testNameNode && testNameNode.type === 'StringLiteral'
          ? testNameNode.value
          : 'anonymous test';

      const testBodyFn = path.node.arguments[1];
      if (!testBodyFn) return;

      const testStartLine = path.node.loc?.start.line || 1;
      const testEndLine = path.node.loc?.end.line || testStartLine;

      let assertionCount = 0;
      let hasWeakAssertion = false;
      let hasTautology = false;
      let weakAssertionLine = testStartLine;
      let weakAssertionSnippet = '';

      // Traverse the inner function body of this test
      path.traverse({
        CallExpression(innerPath: any) {
          const innerCallee = innerPath.node.callee;
          const innerLoc = innerPath.node.loc?.start;
          const lineNum = innerLoc?.line || testStartLine;
          const snippet = lines[lineNum - 1]?.trim() || '';

          // 1. Check Jest/Vitest expect()
          if (innerCallee.type === 'Identifier' && innerCallee.name === 'expect') {
            assertionCount++;
            const parent = innerPath.parent;
            if (parent && parent.type === 'MemberExpression') {
              const matcherCall = parent.property.name;
              if (matcherCall === 'toBeDefined' || matcherCall === 'toBeTruthy') {
                hasWeakAssertion = true;
                weakAssertionLine = lineNum;
                weakAssertionSnippet = snippet;
              }
            }
          }

          // 2. Check Node assert
          if (
            innerCallee.type === 'MemberExpression' &&
            innerCallee.object.name === 'assert'
          ) {
            assertionCount++;
            const method = innerCallee.property.name;
            if (method === 'ok') {
              // check if it's checking !== undefined
              if (snippet.includes('!== undefined') || snippet.includes('!= null')) {
                hasWeakAssertion = true;
                weakAssertionLine = lineNum;
                weakAssertionSnippet = snippet;
              }
            } else if (method === 'strictEqual' || method === 'equal') {
              const args = innerPath.node.arguments;
              if (args.length >= 2) {
                // Check for assert.strictEqual(true, true)
                if (
                  args[0].type === 'BooleanLiteral' &&
                  args[1].type === 'BooleanLiteral' &&
                  args[0].value === args[1].value
                ) {
                  hasTautology = true;
                  weakAssertionLine = lineNum;
                  weakAssertionSnippet = snippet;
                }
              }
            }
          }
        },
      });

      // Report findings for this test block
      if (assertionCount === 0) {
        findings.push({
          classification: 'Weak assertion',
          severity: 'critical',
          title: `Run-Only Test: "${testName}" has 0 assertions`,
          filePath,
          line: testStartLine,
          whyUnreliable:
            'This test executes code paths but verifies no postconditions or output. Any logic bug that does not trigger an unhandled crash will be reported as passing.',
          suggestedFix:
            'Add explicit assertions verifying return values or state mutations (e.g. assert.strictEqual(result, expected)).',
          confidence: 'high',
          confidenceScore: 0.98,
          evidence: {
            snippet: lines.slice(testStartLine - 1, Math.min(testEndLine, testStartLine + 5)).join('\n'),
            details: `Test function "${testName}" made 0 assertion calls.`,
          },
          ruleId: 'TEST-NO-ASSERTION',
        });
      } else if (hasTautology) {
        findings.push({
          classification: 'Weak assertion',
          severity: 'critical',
          title: `Tautological Assertion in "${testName}"`,
          filePath,
          line: weakAssertionLine,
          whyUnreliable:
            'The test asserts a constant literal against itself (e.g. true === true), validating none of the system-under-test behavior.',
          suggestedFix:
            'Replace constant assertion with an assertion on the actual returned calculation.',
          confidence: 'high',
          confidenceScore: 0.99,
          evidence: {
            snippet: weakAssertionSnippet,
            actualAssertion: weakAssertionSnippet,
          },
          ruleId: 'TEST-TAUTOLOGY',
        });
      } else if (hasWeakAssertion) {
        findings.push({
          classification: 'Weak assertion',
          severity: 'medium',
          title: `Shallow Assertion in "${testName}"`,
          filePath,
          line: weakAssertionLine,
          whyUnreliable:
            'Checking only that a result is defined or truthy allows arbitrary incorrect calculations to pass without verifying functional correctness.',
          suggestedFix:
            'Assert the exact expected output value rather than shallow presence.',
          confidence: 'high',
          confidenceScore: 0.95,
          evidence: {
            snippet: weakAssertionSnippet,
            actualAssertion: weakAssertionSnippet,
          },
          ruleId: 'TEST-SHALLOW-TRUTHINESS',
        });
      }
    },
  });

  // Cross-file check: Uncovered exceptions
  for (const src of sourceFiles) {
    if (src.content.includes('throw new Error') || src.content.includes('throw Error')) {
      const hasExceptionCheck =
        content.includes('assert.throws') ||
        content.includes('.toThrow') ||
        content.includes('try {') ||
        content.includes('try{');

      if (!hasExceptionCheck) {
        findings.push({
          classification: 'Missing scenario',
          severity: 'high',
          title: `Missing Exception Test for ${src.relativePath}`,
          filePath,
          line: 1,
          whyUnreliable: `Source file "${src.relativePath}" contains explicit error handling (throw new Error), but no test verifies this exception condition.`,
          suggestedFix:
            'Add a test checking that the function throws an expected error when supplied invalid or boundary arguments.',
          confidence: 'medium',
          confidenceScore: 0.9,
          evidence: {
            details: `Source file ${src.relativePath} has throw Error statements that are never asserted with assert.throws() or .toThrow().`,
          },
          ruleId: 'TEST-MISSING-EXCEPTION',
        });
      }
    }
  }

  return findings;
}

function analyzeWithRegexFallback(
  filePath: string,
  content: string,
  lines: string[]
): RawFinding[] {
  const findings: RawFinding[] = [];
  lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    if (line.includes('expect(true).toBe(true)') || line.includes('assert.strictEqual(true, true)')) {
      findings.push({
        classification: 'Weak assertion',
        severity: 'critical',
        title: 'Tautological Assertion',
        filePath,
        line: lineNum,
        whyUnreliable: 'Asserts a constant against itself.',
        suggestedFix: 'Assert the actual calculated result.',
        confidence: 'high',
        confidenceScore: 0.99,
        evidence: { snippet: line.trim() },
        ruleId: 'TEST-TAUTOLOGY',
      });
    } else if (line.includes('.toBeDefined()') || line.includes('assert.ok(result !== undefined)')) {
      findings.push({
        classification: 'Weak assertion',
        severity: 'medium',
        title: 'Shallow Truthiness Assertion',
        filePath,
        line: lineNum,
        whyUnreliable: 'Asserts presence rather than correctness.',
        suggestedFix: 'Assert expected value.',
        confidence: 'high',
        confidenceScore: 0.95,
        evidence: { snippet: line.trim() },
        ruleId: 'TEST-SHALLOW-TRUTHINESS',
      });
    }
  });
  return findings;
}

