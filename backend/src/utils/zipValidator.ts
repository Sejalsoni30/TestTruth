import path from 'path';
import AdmZip from 'adm-zip';

export interface ValidatedZipEntry {
  entryName: string;
  normalizedPath: string;
  isText: boolean;
  size: number;
  getData: () => Buffer;
}

const MAX_TOTAL_UNCOMPRESSED_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB
const MAX_FILE_COUNT = 500;
const ALLOWED_EXTENSIONS = new Set([
  '.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs',
  '.json', '.jsonc', '.md', '.txt', '.yml', '.yaml'
]);

export function validateAndExtractZip(
  zipBuffer: Buffer,
  destinationDir: string
): ValidatedZipEntry[] {
  const zip = new AdmZip(zipBuffer);
  const entries = zip.getEntries();

  if (entries.length > MAX_FILE_COUNT) {
    throw new Error(`ZIP archive contains too many files (${entries.length} > limit of ${MAX_FILE_COUNT})`);
  }

  let totalSize = 0;
  const validatedEntries: ValidatedZipEntry[] = [];
  const normalizedDest = path.resolve(destinationDir);

  for (const entry of entries) {
    if (entry.isDirectory) continue;

    // Check entry name for Zip Slip
    const entryName = entry.entryName.replace(/\\/g, '/');
    if (entryName.includes('..') || entryName.startsWith('/') || /^[a-zA-Z]:/.test(entryName)) {
      throw new Error(`Security Exception: Detected illegal path traversal attempt in entry: "${entryName}"`);
    }

    // Target absolute path check
    const resolvedPath = path.resolve(normalizedDest, entryName);
    if (!resolvedPath.startsWith(normalizedDest + path.sep) && resolvedPath !== normalizedDest) {
      throw new Error(`Security Exception: Entry "${entryName}" resolves outside destination boundary.`);
    }

    // Check size against zip bomb limits
    totalSize += entry.header.size;
    if (totalSize > MAX_TOTAL_UNCOMPRESSED_SIZE_BYTES) {
      throw new Error('Security Exception: ZIP payload exceeds maximum allowable uncompressed size (50MB).');
    }

    const ext = path.extname(entryName).toLowerCase();
    const isText = ALLOWED_EXTENSIONS.has(ext);

    // Skip node_modules, git directories, dist
    if (
      entryName.includes('node_modules/') ||
      entryName.includes('.git/') ||
      entryName.includes('.next/') ||
      entryName.includes('dist/') ||
      entryName.includes('coverage/') ||
      entryName.startsWith('.env')
    ) {
      continue;
    }

    validatedEntries.push({
      entryName,
      normalizedPath: resolvedPath,
      isText,
      size: entry.header.size,
      getData: () => entry.getData(),
    });
  }

  return validatedEntries;
}

