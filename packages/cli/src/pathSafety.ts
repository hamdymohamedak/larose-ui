import { resolve, sep } from 'node:path';

/**
 * Resolves `targetPath` under `rootDir` and rejects path traversal outside the root.
 */
export function resolveSafePath(rootDir: string, targetPath: string): string {
  const root = resolve(rootDir);
  const resolved = resolve(root, targetPath);

  if (resolved === root) {
    return resolved;
  }

  if (!resolved.startsWith(root + sep)) {
    throw new Error(`Path must stay within the project directory: ${targetPath}`);
  }

  return resolved;
}
