import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import {
  validateContract,
  isDataContract,
  type ContractSchema,
} from '@larose-ui/contracts';
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
  computeQualityScores,
  qualityPassed,
  compareVisualBaseline,
  scanStoryManifest,
  resolveLaRoseConfig,
  type BrowserMatrix,
  type BrowserMatrixCheck,
  type Diagnostic,
  type DiagnosticCategory,
  type DiagnosticSeverity,
  type LaRoseQualityConfig,
  type VisualBaseline,
  type VisualRegressionResult,
} from '@larose-ui/quality-core';

export type { Diagnostic, DiagnosticCategory, DiagnosticSeverity };

async function loadLaRoseConfig(rootDir: string): Promise<LaRoseQualityConfig> {
  try {
    const raw = await readFile(join(rootDir, 'larose.config.json'), 'utf-8');
    return resolveLaRoseConfig(JSON.parse(raw) as Partial<LaRoseQualityConfig>);
  } catch {
    return resolveLaRoseConfig();
  }
}

export interface DoctorOptions {
  ci?: boolean;
  skipVisual?: boolean;
  skipBrowser?: boolean;
}

export interface DoctorResult {
  passed: boolean;
  diagnostics: Diagnostic[];
  quality: import('@larose-ui/quality-core').QualitySummary;
  browserMatrix?: BrowserMatrixCheck;
  visualRegression?: VisualRegressionResult;
}

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

async function checkAccessibility(
  rootDir: string,
  config: LaRoseQualityConfig,
): Promise<Diagnostic[]> {
  const diagnostics: Diagnostic[] = [];

  for (const framework of config.frameworks) {
    const extensions = framework.componentExtensions ?? ['.tsx'];
    const componentRoot = join(rootDir, framework.componentsRoot);

    let reactFiles: string[] = [];
    try {
      reactFiles = await walkDir(componentRoot, extensions);
    } catch {
      continue;
    }

    for (const file of reactFiles) {
      if (file.includes('.test.')) continue;
      const content = await readFile(file, 'utf-8');
      const rel = relative(rootDir, file);
      const result = scanComponentSource(content, rel);

      for (const v of result.violations) {
        diagnostics.push({
          severity: v.severity,
          category: 'accessibility',
          message: `[${framework.id}] ${v.message}`,
          fix: v.fix,
          file: v.file,
        });
      }
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
      const data = JSON.parse(raw) as Record<string, unknown>;

      if (isDataContract(data)) {
        const result = validateContract(
          (data as { ui: ContractSchema }).ui,
          (data as { api: ContractSchema }).api,
        );
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

  diagnostics.push(...(await checkComponentContracts(rootDir)));

  return diagnostics;
}

async function checkComponentContracts(rootDir: string): Promise<Diagnostic[]> {
  const diagnostics: Diagnostic[] = [];
  const componentsDir = join(rootDir, 'contracts/components');

  try {
    await readdir(componentsDir);
  } catch {
    return diagnostics;
  }

  try {
    const { spawnSync } = await import('node:child_process');
    const scriptPath = join(rootDir, 'scripts/check-component-contracts.mjs');
    const result = spawnSync(process.execPath, [scriptPath], {
      cwd: rootDir,
      encoding: 'utf-8',
    });

    if (result.status !== 0) {
      diagnostics.push({
        severity: 'warning',
        category: 'contract',
        message: `Component contract parity check failed: ${result.stderr || result.stdout || 'unknown error'}`,
        fix: 'Run pnpm generate:contracts after building @larose-ui/contracts',
      });
      return diagnostics;
    }

    const payload = JSON.parse(result.stdout || '{"diagnostics":[]}') as {
      diagnostics: Array<{
        severity: DiagnosticSeverity;
        message: string;
        file?: string;
        fix?: string;
      }>;
    };

    for (const item of payload.diagnostics) {
      diagnostics.push({
        severity: item.severity,
        category: 'contract',
        message: item.message,
        file: item.file,
        fix: item.fix,
      });
    }
  } catch (error) {
    diagnostics.push({
      severity: 'warning',
      category: 'contract',
      message: `Could not run component contract parity check: ${error instanceof Error ? error.message : String(error)}`,
      fix: 'Run pnpm generate:contracts',
    });
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

async function checkVisualRegression(
  rootDir: string,
  config: LaRoseQualityConfig,
): Promise<{
  diagnostics: Diagnostic[];
  result: VisualRegressionResult;
}> {
  const diagnostics: Diagnostic[] = [];
  const framework = config.frameworks[0];
  const storiesDir = join(rootDir, framework?.storiesDir ?? 'apps/playground/stories');
  const current = await scanStoryManifest(storiesDir, {
    storySuffix: framework?.storySuffix,
  });

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
  const config = await loadLaRoseConfig(rootDir);
  const { result } = await checkVisualRegression(rootDir, config);
  return result;
}

export async function runDoctor(
  rootDir: string,
  options: DoctorOptions = {},
): Promise<DoctorResult> {
  const config = await loadLaRoseConfig(rootDir);
  const diagnostics = [
    ...(await checkDeprecations(rootDir)),
    ...(await checkAccessibility(rootDir, config)),
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
    const visual = await checkVisualRegression(rootDir, config);
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
