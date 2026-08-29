import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { validateContract, type ContractSchema } from '@larose/contracts';
import { scanComponentSource } from '@larose/accessibility';
import {
  generateMigrationReport,
  formatMigrationReport,
  scanSource,
  applyCodemodsToFiles,
  formatCodemodReport,
} from '@larose/migration';

export type DiagnosticSeverity = 'error' | 'warning' | 'info';

export interface Diagnostic {
  severity: DiagnosticSeverity;
  category: 'bundle' | 'deprecation' | 'contract' | 'accessibility' | 'build';
  message: string;
  fix?: string;
  file?: string;
}

export interface DoctorResult {
  passed: boolean;
  diagnostics: Diagnostic[];
}

const BUNDLE_BUDGETS_KB: Record<string, number> = {
  '@larose/core': 5,
  '@larose/tokens': 5,
  '@larose/network': 5,
  '@larose/offline': 5,
  '@larose/permissions': 8,
  '@larose/data': 15,
  '@larose/forms': 10,
  '@larose/react': 70,
  '@larose/runtime': 25,
  '@larose/observability': 15,
  '@larose/contracts': 5,
  '@larose/migration': 8,
  '@larose/testing': 10,
  '@larose/devtools': 15,
  '@larose/enterprise': 25,
  '@larose/ai': 20,
  '@larose/accessibility': 5,
  '@larose/themes': 5,
};

async function walkDir(dir: string, ext: string[]): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.name === 'node_modules' || entry.name === 'dist' && dir.includes('node_modules')) continue;
    if (entry.isDirectory()) {
      files.push(...(await walkDir(full, ext)));
    } else if (ext.some((e) => entry.name.endsWith(e))) {
      files.push(full);
    }
  }
  return files;
}

async function checkBundleBudgets(packagesDir: string): Promise<Diagnostic[]> {
  const diagnostics: Diagnostic[] = [];
  const packages = await readdir(packagesDir, { withFileTypes: true });

  for (const pkg of packages) {
    if (!pkg.isDirectory()) continue;
    const pkgName = `@larose/${pkg.name}`;
    const budget = BUNDLE_BUDGETS_KB[pkgName];
    if (!budget) continue;

    const distFile = join(packagesDir, pkg.name, 'dist', 'index.js');
    try {
      const info = await stat(distFile);
      const sizeKb = info.size / 1024;
      if (sizeKb > budget) {
        diagnostics.push({
          severity: 'error',
          category: 'bundle',
          message: `${pkgName} bundle ${sizeKb.toFixed(1)}KB exceeds budget ${budget}KB`,
          fix: 'Reduce bundle size or update budget in doctor.ts',
          file: distFile,
        });
      } else if (sizeKb > budget * 0.9) {
        diagnostics.push({
          severity: 'warning',
          category: 'bundle',
          message: `${pkgName} bundle ${sizeKb.toFixed(1)}KB approaching budget ${budget}KB`,
          file: distFile,
        });
      }
    } catch {
      diagnostics.push({
        severity: 'error',
        category: 'build',
        message: `${pkgName} missing dist/index.js — run pnpm build`,
        fix: 'pnpm build',
      });
    }
  }

  return diagnostics;
}

async function checkDeprecations(rootDir: string): Promise<Diagnostic[]> {
  const diagnostics: Diagnostic[] = [];
  const srcFiles = await walkDir(join(rootDir, 'packages'), ['.ts', '.tsx']);
  const appFiles = await walkDir(join(rootDir, 'apps'), ['.ts', '.tsx']);
  const allFiles = [...srcFiles, ...appFiles];

  for (const file of allFiles) {
    if (file.includes('.test.') || file.includes('node_modules')) continue;
    if (file.includes('packages/migration/')) continue;
    const content = await readFile(file, 'utf-8');
    const matches = scanSource(content, relative(rootDir, file));
    for (const m of matches) {
      diagnostics.push({
        severity: 'warning',
        category: 'deprecation',
        message: m.message,
        fix: m.replacement,
        file: m.file,
      });
    }
  }

  return diagnostics;
}

async function checkAccessibility(rootDir: string): Promise<Diagnostic[]> {
  const diagnostics: Diagnostic[] = [];
  const reactFiles = await walkDir(join(rootDir, 'packages/react/src'), ['.tsx']);

  for (const file of reactFiles) {
    if (file.includes('.test.')) continue;
    const content = await readFile(file, 'utf-8');
    const rel = relative(rootDir, file);
    const result = scanComponentSource(content, rel);

    for (const v of result.violations) {
      diagnostics.push({
        severity: v.severity,
        category: 'accessibility',
        message: v.message,
        fix: v.fix,
        file: v.file,
      });
    }
  }

  return diagnostics;
}

async function checkContracts(rootDir: string): Promise<Diagnostic[]> {
  const diagnostics: Diagnostic[] = [];
  const contractsDir = join(rootDir, 'contracts');

  try {
    const files = await readdir(contractsDir);
    for (const file of files) {
      if (!file.endsWith('.json')) continue;
      const raw = await readFile(join(contractsDir, file), 'utf-8');
      const data = JSON.parse(raw) as { ui?: ContractSchema; api?: ContractSchema };
      if (data.ui && data.api) {
        const result = validateContract(data.ui, data.api);
        if (!result.valid) {
          for (const m of result.mismatches.filter((x) => x.severity === 'error')) {
            diagnostics.push({
              severity: 'error',
              category: 'contract',
              message: m.message,
              file: join('contracts', file),
            });
          }
        }
      }
    }
  } catch {
    // no contracts dir — ok
  }

  return diagnostics;
}

export async function runDoctor(rootDir: string): Promise<DoctorResult> {
  const packagesDir = join(rootDir, 'packages');
  const diagnostics = [
    ...(await checkBundleBudgets(packagesDir)),
    ...(await checkDeprecations(rootDir)),
    ...(await checkAccessibility(rootDir)),
    ...(await checkContracts(rootDir)),
  ];

  const passed = diagnostics.filter((d) => d.severity === 'error').length === 0;
  return { passed, diagnostics };
}

export function formatDoctorReport(result: DoctorResult): string {
  const lines = ['laRose Doctor', ''];

  if (result.diagnostics.length === 0) {
    lines.push('All checks passed.');
    return lines.join('\n');
  }

  for (const d of result.diagnostics) {
    lines.push(`[${d.severity.toUpperCase()}] ${d.category}: ${d.message}`);
    if (d.file) lines.push(`  File: ${d.file}`);
    if (d.fix) lines.push(`  Fix: ${d.fix}`);
    lines.push('');
  }

  lines.push(result.passed ? 'Result: PASS' : 'Result: FAIL');
  return lines.join('\n');
}

export async function runMigrate(
  rootDir: string,
  targetVersion: string,
  options: { apply?: boolean } = {},
): Promise<string> {
  const files: Array<{ path: string; content: string }> = [];
  const allFiles = [
    ...(await walkDir(join(rootDir, 'packages'), ['.ts', '.tsx'])),
    ...(await walkDir(join(rootDir, 'apps'), ['.ts', '.tsx'])),
  ];

  for (const file of allFiles) {
    if (file.includes('.test.') || file.includes('packages/migration/')) continue;
    files.push({
      path: relative(rootDir, file),
      content: await readFile(file, 'utf-8'),
    });
  }

  const report = generateMigrationReport(files, targetVersion);
  const lines = [formatMigrationReport(report)];

  if (options.apply) {
    const results = applyCodemodsToFiles(files);
    for (const result of results) {
      if (result.changed) {
        await writeFile(join(rootDir, result.path), result.content, 'utf-8');
      }
    }
    lines.push('', formatCodemodReport(results));
  } else if (report.deprecatedUsages.length > 0) {
    lines.push('', `Run: larose migrate --to ${targetVersion} --apply`);
  }

  return lines.join('\n');
}

export function runGenerate(type: 'form' | 'page', name: string): string {
  if (type === 'form') {
    return `import { Form } from '@larose/forms';

const ${name}Schema = {
  id: '${name.toLowerCase()}',
  title: '${name}',
  fields: [
    { name: 'name', type: 'text' as const, label: 'Name', required: true },
  ],
};

export function ${name}Form() {
  return <Form schema={${name}Schema} submitLabel="Save" />;
}
`;
  }

  return `import { LaRoseProvider } from '@larose/runtime';
import { DataView } from '@larose/data';

export function ${name}Page() {
  return (
    <LaRoseProvider permissions={['${name.toLowerCase()}.read']}>
      <DataView url="/api/${name.toLowerCase()}" permission="${name.toLowerCase()}.read">
        {(data) => <pre>{JSON.stringify(data, null, 2)}</pre>}
      </DataView>
    </LaRoseProvider>
  );
}
`;
}
