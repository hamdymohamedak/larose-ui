import type { Diagnostic } from '../doctor.js';
import type { BrowserMatrixCheck } from './browserMatrix.js';
import type { VisualRegressionResult } from './visualManifest.js';

export interface ComponentQualityScore {
  id: string;
  score: number;
  errors: number;
  warnings: number;
  categories: string[];
}

export interface PackageQualityScore {
  package: string;
  score: number;
  bundleKb?: number;
  issues: number;
}

export interface QualitySummary {
  overall: number;
  components: ComponentQualityScore[];
  packages: PackageQualityScore[];
}

const ERROR_PENALTY = 15;
const WARNING_PENALTY = 5;

export function computeQualityScores(
  diagnostics: Diagnostic[],
  options: { ci?: boolean } = {},
): QualitySummary {
  const treatWarningsAsErrors = options.ci === true;
  const componentMap = new Map<string, ComponentQualityScore>();
  const packageMap = new Map<string, PackageQualityScore>();

  for (const diagnostic of diagnostics) {
    const isError =
      diagnostic.severity === 'error' ||
      (treatWarningsAsErrors && diagnostic.severity === 'warning');

    if (diagnostic.category === 'bundle') {
      const pkgMatch = diagnostic.message.match(/^(@larose\/[^\s]+)/);
      const pkg = pkgMatch?.[1] ?? 'unknown';
      const entry = packageMap.get(pkg) ?? {
        package: pkg,
        score: 100,
        issues: 0,
      };
      entry.issues += 1;
      entry.score -= isError ? ERROR_PENALTY : WARNING_PENALTY;
      const sizeMatch = diagnostic.message.match(/bundle\s+([\d.]+)KB/);
      if (sizeMatch?.[1]) entry.bundleKb = Number(sizeMatch[1]);
      packageMap.set(pkg, entry);
      continue;
    }

    const componentId = diagnostic.file ?? 'unknown';
    const entry = componentMap.get(componentId) ?? {
      id: componentId,
      score: 100,
      errors: 0,
      warnings: 0,
      categories: [],
    };

    if (diagnostic.severity === 'error') entry.errors += 1;
    if (diagnostic.severity === 'warning') entry.warnings += 1;
    entry.score -= isError ? ERROR_PENALTY : WARNING_PENALTY;
    if (!entry.categories.includes(diagnostic.category)) {
      entry.categories.push(diagnostic.category);
    }
    componentMap.set(componentId, entry);
  }

  const components = [...componentMap.values()]
    .map((entry) => ({ ...entry, score: clampScore(entry.score) }))
    .sort((a, b) => a.score - b.score);

  const packages = [...packageMap.values()]
    .map((entry) => ({ ...entry, score: clampScore(entry.score) }))
    .sort((a, b) => a.score - b.score);

  const overall = clampScore(
    average([
      ...components.map((entry) => entry.score),
      ...packages.map((entry) => entry.score),
    ]) ?? 100,
  );

  return { overall, components, packages };
}

function average(values: number[]): number | undefined {
  if (values.length === 0) return undefined;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function qualityPassed(
  diagnostics: Diagnostic[],
  options: {
    ci?: boolean;
    browserMatrix?: BrowserMatrixCheck;
    visualRegression?: VisualRegressionResult;
  } = {},
): boolean {
  const treatWarningsAsErrors = options.ci === true;
  const hasBlockingDiagnostics = diagnostics.some((diagnostic) =>
    treatWarningsAsErrors
      ? diagnostic.severity === 'error' || diagnostic.severity === 'warning'
      : diagnostic.severity === 'error',
  );

  if (hasBlockingDiagnostics) return false;
  if (options.browserMatrix && !options.browserMatrix.passed) return false;
  if (options.visualRegression && !options.visualRegression.passed) return false;
  return true;
}
