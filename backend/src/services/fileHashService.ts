import crypto from 'crypto';

export interface FileHashComparison {
  changed: string[];
  added: string[];
  deleted: string[];
  unchanged: string[];
  currentHashes: Record<string, string>;
  isIncremental: boolean;
}

export function computeContentHash(content: string): string {
  return crypto.createHash('sha256').update(content, 'utf8').digest('hex');
}

export function compareFileHashes(
  currentFiles: Array<{ relativePath: string; content: string }>,
  previousHashes: Record<string, string> | undefined
): FileHashComparison {
  const currentHashes: Record<string, string> = {};
  for (const file of currentFiles) {
    currentHashes[file.relativePath] = computeContentHash(file.content);
  }

  if (!previousHashes || Object.keys(previousHashes).length === 0) {
    return {
      changed: [],
      added: Object.keys(currentHashes),
      deleted: [],
      unchanged: [],
      currentHashes,
      isIncremental: false,
    };
  }

  const changed: string[] = [];
  const added: string[] = [];
  const unchanged: string[] = [];
  const previousPaths = new Set(Object.keys(previousHashes));

  for (const [filePath, currentHash] of Object.entries(currentHashes)) {
    if (previousPaths.has(filePath)) {
      if (previousHashes[filePath] === currentHash) {
        unchanged.push(filePath);
      } else {
        changed.push(filePath);
      }
      previousPaths.delete(filePath);
    } else {
      added.push(filePath);
    }
  }

  const deleted = Array.from(previousPaths);

  const isIncremental = unchanged.length > 0;

  return {
    changed,
    added,
    deleted,
    unchanged,
    currentHashes,
    isIncremental,
  };
}
