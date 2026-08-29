import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { validateContract, type ContractSchema } from '@larose-ui/contracts';
import { scanComponentSource } from '@larose-ui/accessibility';
import {
  generateMigrationReport,
  formatMigrationReport,
  scanSource,
  applyCodemodsToFiles,
  formatCodemodReport,
  runGenerator,
  analyzeRelease,
  formatReleaseReport,
  formatReleaseJson,
  type GeneratorKind,
} from '@larose-ui/migration';
import {
  DEFAULT_BROWSER_MATRIX,
  validateBrowserMatrix,
  type BrowserMatrix,
  type BrowserMatrixCheck,
} from './quality/browserMatrix.js';
import { computeQualityScores, qualityPassed } from './quality/qualityScores.js';
import {
  compareVisualBaseline,
  scanStoryManifest,
  type VisualBaseline,
  type VisualRegressionResult,
} from './quality/visualManifest.js';

export type DiagnosticSeverity = 'error' | 'warning' | 'info';

export type DiagnosticCategory =
  | 'bundle'
  | 'deprecation'
  | 'contract'
  | 'accessibility'
  | 'build'
  | 'browser'
  | 'visual';

export interface Diagnostic {
  severity: DiagnosticSeverity;
  category: DiagnosticCategory;
  message: string;
  fix?: string;
  file?: string;
}

export interface DoctorOptions {
  ci?: boolean;
  skipVisual?: boolean;
  skipBrowser?: boolean;
}

export interface DoctorResult {
  passed: boolean;
  diagnostics: Diagnostic[];
  quality: import('./quality/qualityScores.js').QualitySummary;
  browserMatrix?: import('./quality/browserMatrix.js').BrowserMatrixCheck;
  visualRegression?: import('./quality/visualManifest.js').VisualRegressionResult;
}

const BUNDLE_BUDGETS_KB: Record<string, number> = {
  '@larose-ui/core': 10,
  '@larose-ui/tokens': 5,
  '@larose-ui/network': 6,
  '@larose-ui/offline': 5,
  '@larose-ui/permissions': 8,
  '@larose-ui/data': 15,
  '@larose-ui/forms': 10,
  '@larose-ui/react': 70,
  '@larose-ui/runtime': 36,
  '@larose-ui/observability': 26,
  '@larose-ui/contracts': 5,
  '@larose-ui/migration': 14,
  '@larose-ui/testing': 10,
  '@larose-ui/cli': 50,
  '@larose-ui/devtools': 22,
  '@larose-ui/enterprise': 25,
  '@larose-ui/ai': 20,
  '@larose-ui/accessibility': 5,
  '@larose-ui/themes': 5,
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

const BUNDLE_ENTRY: Record<string, string> = {
  '@larose-ui/cli': 'dist/cli.js',
};

async function checkBundleBudgets(packagesDir: string): Promise<Diagnostic[]> {
  const diagnostics: Diagnostic[] = [];
  const packages = await readdir(packagesDir, { withFileTypes: true });

  for (const pkg of packages) {
    if (!pkg.isDirectory()) continue;
    const pkgName = `@larose-ui/${pkg.name}`;
    const budget = BUNDLE_BUDGETS_KB[pkgName];
    if (!budget) continue;

    const distFile = join(packagesDir, pkg.name, BUNDLE_ENTRY[pkgName] ?? 'dist/index.js');
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
          severity: 'info',
          category: 'bundle',
          message: `${pkgName} bundle ${sizeKb.toFixed(1)}KB approaching budget ${budget}KB`,
          file: distFile,
        });
      }
    } catch {
      diagnostics.push({
        severity: 'error',
        category: 'build',
        message: `${pkgName} missing ${BUNDLE_ENTRY[pkgName] ?? 'dist/index.js'} — run pnpm build`,
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

async function checkBrowserMatrix(rootDir: string): Promise<{
  diagnostics: Diagnostic[];
  check: BrowserMatrixCheck;
}> {
  const diagnostics: Diagnostic[] = [];
  let matrix: BrowserMatrix = DEFAULT_BROWSER_MATRIX;
  let nodeEngine: string | undefined;

  try {
    const raw = await readFile(join(rootDir, 'quality/browser-matrix.json'), 'utf-8');
    matrix = JSON.parse(raw) as BrowserMatrix;
  } catch {
    // use default matrix
  }

  try {
    const pkgRaw = await readFile(join(rootDir, 'package.json'), 'utf-8');
    const pkg = JSON.parse(pkgRaw) as { engines?: { node?: string } };
    nodeEngine = pkg.engines?.node;
  } catch {
    // ignore
  }

  const check = validateBrowserMatrix(matrix, nodeEngine);
  for (const issue of check.issues) {
    diagnostics.push({
      severity: 'error',
      category: 'browser',
      message: issue,
      fix: 'Align package.json engines with quality/browser-matrix.json',
    });
  }

  return { diagnostics, check };
}

async function checkVisualRegression(rootDir: string): Promise<{
  diagnostics: Diagnostic[];
  result: VisualRegressionResult;
}> {
  const diagnostics: Diagnostic[] = [];
  const storiesDir = join(rootDir, 'apps/playground/stories');
  const current = await scanStoryManifest(storiesDir);

  let baseline: VisualBaseline = { version: 1, stories: [] };
  try {
    const raw = await readFile(join(rootDir, 'quality/visual-baseline.json'), 'utf-8');
    baseline = JSON.parse(raw) as VisualBaseline;
  } catch {
    diagnostics.push({
      severity: 'error',
      category: 'visual',
      message: 'Missing quality/visual-baseline.json',
      fix: 'Add visual baseline manifest for Storybook stories',
      file: 'quality/visual-baseline.json',
    });
    return {
      diagnostics,
      result: {
        passed: false,
        current,
        missing: baseline.stories,
        added: current,
        changed: [],
      },
    };
  }

  const result = compareVisualBaseline(current, baseline);

  for (const story of result.missing) {
    diagnostics.push({
      severity: 'error',
      category: 'visual',
      message: `Story removed from baseline: ${story.file} (${story.title})`,
      fix: 'Restore story or update quality/visual-baseline.json intentionally',
      file: join('apps/playground/stories', story.file),
    });
  }

  for (const change of result.changed) {
    diagnostics.push({
      severity: 'warning',
      category: 'visual',
      message: `Story title changed: ${change.file} "${change.baselineTitle}" → "${change.currentTitle}"`,
      fix: 'Update quality/visual-baseline.json if rename is intentional',
      file: join('apps/playground/stories', change.file),
    });
  }

  for (const story of result.added) {
    diagnostics.push({
      severity: 'warning',
      category: 'visual',
      message: `New story not in baseline: ${story.file} (${story.title})`,
      fix: 'Add entry to quality/visual-baseline.json',
      file: join('apps/playground/stories', story.file),
    });
  }

  return { diagnostics, result };
}

export async function runVisualRegressionCheck(rootDir: string): Promise<VisualRegressionResult> {
  const { result } = await checkVisualRegression(rootDir);
  return result;
}

export async function runDoctor(
  rootDir: string,
  options: DoctorOptions = {},
): Promise<DoctorResult> {
  const packagesDir = join(rootDir, 'packages');
  const diagnostics = [
    ...(await checkBundleBudgets(packagesDir)),
    ...(await checkDeprecations(rootDir)),
    ...(await checkAccessibility(rootDir)),
    ...(await checkContracts(rootDir)),
  ];

  let browserMatrix: BrowserMatrixCheck | undefined;
  if (!options.skipBrowser) {
    const browser = await checkBrowserMatrix(rootDir);
    diagnostics.push(...browser.diagnostics);
    browserMatrix = browser.check;
  }

  let visualRegression: VisualRegressionResult | undefined;
  if (!options.skipVisual) {
    const visual = await checkVisualRegression(rootDir);
    diagnostics.push(...visual.diagnostics);
    visualRegression = visual.result;
  }

  const quality = computeQualityScores(diagnostics, { ci: options.ci });
  const passed = qualityPassed(diagnostics, {
    ci: options.ci,
    browserMatrix,
    visualRegression,
  });

  return { passed, diagnostics, quality, browserMatrix, visualRegression };
}

export function formatDoctorReport(result: DoctorResult, options: DoctorOptions = {}): string {
  const lines = ['laRose Doctor', ''];
  lines.push(`Quality score: ${result.quality.overall}/100`);
  if (options.ci) lines.push('Mode: CI (warnings fail)');
  lines.push('');

  if (result.diagnostics.length === 0) {
    lines.push('All checks passed.');
    lines.push('');
    lines.push('Result: PASS');
    return lines.join('\n');
  }

  for (const d of result.diagnostics) {
    if (d.severity === 'info') continue;
    lines.push(`[${d.severity.toUpperCase()}] ${d.category}: ${d.message}`);
    if (d.file) lines.push(`  File: ${d.file}`);
    if (d.fix) lines.push(`  Fix: ${d.fix}`);
    lines.push('');
  }

  if (result.quality.components.length > 0) {
    lines.push('Lowest component scores:');
    for (const component of result.quality.components.slice(0, 5)) {
      lines.push(
        `  ${component.id}: ${component.score}/100 (${component.errors}e/${component.warnings}w)`,
      );
    }
    lines.push('');
  }

  lines.push(result.passed ? 'Result: PASS' : 'Result: FAIL');
  return lines.join('\n');
}

export function formatDoctorJson(result: DoctorResult, options: DoctorOptions = {}): string {
  return JSON.stringify(
    {
      passed: result.passed,
      ci: options.ci === true,
      qualityScore: result.quality.overall,
      quality: result.quality,
      browserMatrix: result.browserMatrix,
      visualRegression: result.visualRegression
        ? {
            passed: result.visualRegression.passed,
            storyCount: result.visualRegression.current.length,
            missing: result.visualRegression.missing,
            added: result.visualRegression.added,
            changed: result.visualRegression.changed,
          }
        : undefined,
      diagnostics: result.diagnostics,
    },
    null,
    2,
  );
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

export function runGenerate(type: GeneratorKind, name: string): string {
  return runGenerator(type, name);
}

export async function runRelease(
  rootDir: string,
  json = false,
): Promise<{ output: string; ready: boolean }> {
  const packagesDir = join(rootDir, 'packages');
  const entries = await readdir(packagesDir, { withFileTypes: true });
  const manifests = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    try {
      const raw = await readFile(join(packagesDir, entry.name, 'package.json'), 'utf-8');
      const pkg = JSON.parse(raw) as {
        name: string;
        version?: string;
        private?: boolean;
        license?: string;
        publishConfig?: { access?: string };
      };
      manifests.push({
        name: pkg.name,
        version: pkg.version,
        private: pkg.private,
        license: pkg.license,
        publishConfig: pkg.publishConfig,
        directory: `packages/${entry.name}`,
      });
    } catch {
      // skip packages without package.json
    }
  }

  const report = analyzeRelease(manifests);
  const blocked = report.packages.filter((pkg) => !pkg.private && !pkg.publishReady);
  const ready = report.aligned && blocked.length === 0;
  const output = json ? formatReleaseJson(report) : formatReleaseReport(report);
  return { output, ready };
}
