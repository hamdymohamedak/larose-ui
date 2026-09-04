export interface Deprecation {
  id: string;
  pattern: RegExp;
  message: string;
  replacement: string;
  removedIn?: string;
}

export const DEPRECATIONS: Deprecation[] = [
  {
    id: 'role-check',
    pattern: /user\.role\s*===\s*['"]admin['"]/g,
    message: 'Inline role checks are deprecated',
    replacement: 'Use <Can permission="..."> from @larose-ui/permissions-react',
    removedIn: '1.0.0',
  },
  {
    id: 'old-token',
    pattern: /--ui-color-primary/g,
    message: 'Old token prefix --ui-color-* is deprecated',
    replacement: 'Use --lr-color-* tokens from @larose-ui/tokens',
    removedIn: '1.0.0',
  },
  {
    id: 'react-provider',
    pattern:
      /import\s+\{[^}]*\bLaRoseProvider\b[^}]*\}\s+from\s+['"]@larose-ui\/react['"]/g,
    message: 'Import LaRoseProvider from @larose-ui/runtime-react instead',
    replacement: "import { LaRoseProvider } from '@larose-ui/runtime-react'",
    removedIn: '0.2.0',
  },
  {
    id: 'runtime-toast',
    pattern: /import\s+\{([^}]*\buseToast\b[^}]*)\}\s+from\s+['"]@larose-ui\/runtime['"]/g,
    message: 'Import useToast from @larose-ui/runtime-react/toast',
    replacement: "import { useToast } from '@larose-ui/runtime-react/toast'",
    removedIn: '0.2.0',
  },
];

export interface DeprecationMatch {
  id: string;
  file: string;
  line: number;
  column: number;
  message: string;
  replacement: string;
}

export interface MigrationReport {
  targetVersion: string;
  deprecatedUsages: DeprecationMatch[];
  breakingChanges: number;
  summary: string;
}

export function scanSource(source: string, filePath: string): DeprecationMatch[] {
  const matches: DeprecationMatch[] = [];
  const lines = source.split('\n');

  for (const dep of DEPRECATIONS) {
    dep.pattern.lastIndex = 0;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]!;
      const lineMatches = line.matchAll(dep.pattern);
      for (const m of lineMatches) {
        matches.push({
          id: dep.id,
          file: filePath,
          line: i + 1,
          column: (m.index ?? 0) + 1,
          message: dep.message,
          replacement: dep.replacement,
        });
      }
    }
  }

  return matches;
}

export function generateMigrationReport(
  files: Array<{ path: string; content: string }>,
  targetVersion = '1.0.0',
): MigrationReport {
  const deprecatedUsages = files.flatMap((f) => scanSource(f.content, f.path));

  return {
    targetVersion,
    deprecatedUsages,
    breakingChanges: deprecatedUsages.filter((d) =>
      DEPRECATIONS.find((x) => x.id === d.id)?.removedIn === targetVersion,
    ).length,
    summary: `${deprecatedUsages.length} deprecated usages found`,
  };
}

export function formatMigrationReport(report: MigrationReport): string {
  const lines = [
    `laRose Migration Report (target: v${report.targetVersion})`,
    '',
    report.summary,
    `Breaking changes: ${report.breakingChanges}`,
    '',
  ];

  if (report.deprecatedUsages.length === 0) {
    lines.push('No deprecated patterns detected.');
  } else {
    for (const u of report.deprecatedUsages) {
      lines.push(`${u.file}:${u.line}:${u.column} [${u.id}]`);
      lines.push(`  ${u.message}`);
      lines.push(`  Fix: ${u.replacement}`);
      lines.push('');
    }
    lines.push(`Run: larose migrate --to ${report.targetVersion}`);
  }

  return lines.join('\n');
}

export {
  applyCodemods,
  applyCodemodsToFiles,
  formatCodemodReport,
  type ApplyCodemodsFileResult,
  type CodemodResult,
} from './codemods';

export {
  generateForm,
  generatePage,
  generateFeature,
  runGenerator,
  type GeneratorKind,
  type GeneratorOptions,
} from './generators';

export {
  PACKAGE_PROFILES,
  appendChangelogUnreleased,
  formatContributeReport,
  formatPackageList,
  listPackageProfiles,
  planComponentScaffold,
  resolvePackageProfile,
  toCamelCase,
  toPascalCase,
  type FrameworkId,
  type PackageProfile,
  type PackageScripts,
  type ScaffoldFile,
  type ScaffoldKind,
  type ScaffoldPlan,
} from './componentScaffold';

export {
  analyzeRelease,
  formatReleaseReport,
  formatReleaseJson,
  type ReleaseReport,
  type PackageReleaseInfo,
  type PackageManifestInput,
} from './release';
