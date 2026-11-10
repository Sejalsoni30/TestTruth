import fs from 'fs/promises';
import path from 'path';
import { runInSandbox } from './sandboxRunner.js';

export type MutationCategory =
  | 'operator'
  | 'boolean'
  | 'condition'
  | 'return_value'
  | 'boundary';

export interface GeneratedMutant {
  filePath: string;
  line: number;
  category: MutationCategory;
  description: string;
  originalCodeSnippet: string;
  mutatedCodeSnippet: string;
  diff: string;
}

export interface ExecutedMutantResult extends GeneratedMutant {
  status: 'killed' | 'survived' | 'timeout' | 'error';
  killingTestName?: string;
  testOutput?: string;
  executionDurationMs: number;
}

const MUTATION_PATTERNS: Array<{
  category: MutationCategory;
  pattern: RegExp;
  replacement: string;
  desc: string;
}> = [
  // Boundary mutations
  { category: 'boundary', pattern: />=/g, replacement: '>', desc: 'Replaced >= with > (boundary threshold)' },
  { category: 'boundary', pattern: /<=/g, replacement: '<', desc: 'Replaced <= with < (boundary threshold)' },
  { category: 'boundary', pattern: /===/g, replacement: '!==', desc: 'Inverted equality check === to !==' },
  { category: 'boundary', pattern: /!==/g, replacement: '===', desc: 'Inverted inequality check !== to ===' },

  // Condition mutations
  { category: 'condition', pattern: />(?!=)/g, replacement: '>=', desc: 'Weakened > to >=' },
  { category: 'condition', pattern: /<(?!=)/g, replacement: '<=', desc: 'Weakened < to <=' },
  { category: 'condition', pattern: /&&/g, replacement: '||', desc: 'Replaced logical AND with OR' },
  { category: 'condition', pattern: /\|\|/g, replacement: '&&', desc: 'Replaced logical OR with AND' },

  // Operator mutations
  { category: 'operator', pattern: /(?<=\w\s*)\+(?=\s*\w)/g, replacement: '-', desc: 'Replaced + with -' },
  { category: 'operator', pattern: /(?<=\w\s*)\-(?=\s*\w)/g, replacement: '+', desc: 'Replaced - with +' },
  { category: 'operator', pattern: /(?<=\w\s*)\*(?=\s*\w)/g, replacement: '/', desc: 'Replaced * with /' },

  // Boolean mutations
  { category: 'boolean', pattern: /\btrue\b/g, replacement: 'false', desc: 'Inverted boolean true to false' },
  { category: 'boolean', pattern: /\bfalse\b/g, replacement: 'true', desc: 'Inverted boolean false to true' },

  // Return value mutations
  { category: 'return_value', pattern: /return 0;/g, replacement: 'return 1;', desc: 'Mutated return 0 to return 1' },
];

export function findMutantsInFile(
  filePath: string,
  content: string
): GeneratedMutant[] {
  const mutants: GeneratedMutant[] = [];
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const trimmed = line.trim();

    // Skip comments, imports, require, exports
    if (
      trimmed.startsWith('//') ||
      trimmed.startsWith('/*') ||
      trimmed.startsWith('*') ||
      trimmed.startsWith('import ') ||
      trimmed.startsWith('const ') && trimmed.includes('require(') ||
      trimmed.startsWith('module.exports') ||
      trimmed.length === 0
    ) {
      return;
    }

    for (const rule of MUTATION_PATTERNS) {
      if (rule.pattern.test(line)) {
        // Reset regex state
        rule.pattern.lastIndex = 0;
        const mutatedLine = line.replace(rule.pattern, rule.replacement);

        if (mutatedLine !== line) {
          mutants.push({
            filePath,
            line: lineNum,
            category: rule.category,
            description: rule.desc,
            originalCodeSnippet: line.trim(),
            mutatedCodeSnippet: mutatedLine.trim(),
            diff: `- ${line.trim()}\n+ ${mutatedLine.trim()}`,
          });
        }
      }
    }
  });

  return mutants;
}

export async function executeMutantsOnProject(
  workDir: string,
  mutantsToRun: GeneratedMutant[],
  testCommand: string = 'node --test',
  timeoutMs: number = 5000
): Promise<ExecutedMutantResult[]> {
  const results: ExecutedMutantResult[] = [];

  for (const mutant of mutantsToRun) {
    const fullFilePath = path.join(workDir, mutant.filePath);
    let originalFileContent = '';

    try {
      originalFileContent = await fs.readFile(fullFilePath, 'utf8');
      const lines = originalFileContent.split('\n');

      if (lines.length >= mutant.line) {
        // Replace target line with mutated line
        lines[mutant.line - 1] = mutant.mutatedCodeSnippet;
        const mutatedFileContent = lines.join('\n');

        await fs.writeFile(fullFilePath, mutatedFileContent, 'utf8');

        // Run tests in sandbox on the mutated code
        const execution = await runInSandbox(workDir, testCommand, timeoutMs);

        // If tests FAILED -> mutant was KILLED
        // If tests PASSED -> mutant SURVIVED
        let status: 'killed' | 'survived' | 'timeout' | 'error' = 'survived';

        if (execution.timedOut) {
          status = 'timeout';
        } else if (execution.exitCode !== 0 || execution.failedTests > 0) {
          status = 'killed';
        } else {
          status = 'survived';
        }

        results.push({
          ...mutant,
          status,
          killingTestName: status === 'killed' ? (execution.stdout.match(/✖\s+([^\n]+)/i)?.[1] || 'Test suite failure') : undefined,
          testOutput: execution.stdout.slice(0, 500),
          executionDurationMs: execution.durationMs,
        });
      }
    } catch (err: any) {
      results.push({
        ...mutant,
        status: 'error',
        testOutput: err.message,
        executionDurationMs: 0,
      });
    } finally {
      // Revert mutated file back to original immediately
      if (originalFileContent) {
        await fs.writeFile(fullFilePath, originalFileContent, 'utf8');
      }
    }
  }

  return results;
}
