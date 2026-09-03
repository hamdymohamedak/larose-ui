import { readFileSync } from 'node:fs';
import ts from 'typescript';

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
      if (!/^[A-Z]/.test(name)) continue;
      if (name.endsWith('Props') || name.endsWith('Variant') || name.endsWith('Config')) continue;
      names.add(name);
    }
  }

  return [...names].sort((a, b) => a.localeCompare(b));
}
