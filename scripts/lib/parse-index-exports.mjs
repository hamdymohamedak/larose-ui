import { readFileSync } from 'node:fs';
import ts from 'typescript';

/**
 * True for real UI components — excludes SCREAMING_SNAKE constants and config blobs.
 * @param {string} name
 */
export function isComponentContractCandidate(name) {
  if (!/^[A-Z][A-Za-z0-9]*$/.test(name)) return false;
  if (name.endsWith('Props') || name.endsWith('Variant') || name.endsWith('Config')) return false;
  if (/^(MAX|MIN|DEFAULT|STANDARD|SYSTEM|LIQUID|DRAG|FOCUS|LAROSE|PATH)_/.test(name)) return false;
  if (/^[A-Z0-9_]+$/.test(name)) return false; // SCREAMING_SNAKE
  return true;
}

/**
 * Parse PascalCase component exports from a package index file (supports multiline exports).
 * @param {string} indexPath
 * @returns {string[]}
 */
export function parseComponentExportsFromIndex(indexPath) {
  const source = readFileSync(indexPath, 'utf8');
  const kind = indexPath.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  const sourceFile = ts.createSourceFile(indexPath, source, ts.ScriptTarget.Latest, true, kind);
  /** @type {Set<string>} */
  const names = new Set();

  for (const statement of sourceFile.statements) {
    if (!ts.isExportDeclaration(statement) || !statement.exportClause) continue;
    if (statement.isTypeOnly) continue;
    if (!ts.isNamedExports(statement.exportClause)) continue;

    for (const element of statement.exportClause.elements) {
      const name = element.name.text;
      if (!isComponentContractCandidate(name)) continue;
      names.add(name);
    }
  }

  return [...names].sort((a, b) => a.localeCompare(b));
}
