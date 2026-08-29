export interface PackageReleaseInfo {
  name: string;
  version: string;
  directory: string;
  private: boolean;
  publishReady: boolean;
  issues: string[];
}

export interface ReleaseReport {
  generatedAt: string;
  packageCount: number;
  publishableCount: number;
  aligned: boolean;
  canonicalVersion: string | null;
  packages: PackageReleaseInfo[];
  drift: Array<{ name: string; version: string; expected: string }>;
  recommendations: string[];
}

export interface PackageManifestInput {
  name: string;
  version?: string;
  private?: boolean;
  license?: string;
  publishConfig?: { access?: string };
  directory: string;
}

export function analyzeRelease(manifests: PackageManifestInput[]): ReleaseReport {
  const packages: PackageReleaseInfo[] = manifests.map((manifest) => {
    const issues: string[] = [];
    const isPrivate = manifest.private === true;

    if (!manifest.version) issues.push('missing version');
    if (!isPrivate && !manifest.license) issues.push('missing license');
    if (!isPrivate && !manifest.publishConfig?.access) {
      issues.push('missing publishConfig.access');
    }

    return {
      name: manifest.name,
      version: manifest.version ?? '0.0.0',
      directory: manifest.directory,
      private: isPrivate,
      publishReady: issues.length === 0,
      issues,
    };
  });

  const publishable = packages.filter((pkg) => !pkg.private);
  const versions = publishable.map((pkg) => pkg.version);
  const versionCounts = new Map<string, number>();
  for (const version of versions) {
    versionCounts.set(version, (versionCounts.get(version) ?? 0) + 1);
  }

  let canonicalVersion: string | null = null;
  let maxCount = 0;
  for (const [version, count] of versionCounts) {
    if (count > maxCount) {
      maxCount = count;
      canonicalVersion = version;
    }
  }

  const drift =
    canonicalVersion === null
      ? []
      : publishable
          .filter((pkg) => pkg.version !== canonicalVersion)
          .map((pkg) => ({
            name: pkg.name,
            version: pkg.version,
            expected: canonicalVersion!,
          }));

  const recommendations: string[] = [];
  if (drift.length > 0) {
    recommendations.push(
      `Align ${drift.length} package version(s) to ${canonicalVersion} before release`,
    );
  }
  if (publishable.some((pkg) => !pkg.publishReady)) {
    recommendations.push('Fix publish metadata on packages flagged not publish-ready');
  }
  if (publishable.length > 0 && drift.length === 0) {
    recommendations.push('Versions aligned — run pnpm verify:publish and pnpm build');
  }

  return {
    generatedAt: new Date().toISOString(),
    packageCount: packages.length,
    publishableCount: publishable.length,
    aligned: drift.length === 0,
    canonicalVersion,
    packages,
    drift,
    recommendations,
  };
}

export function formatReleaseReport(report: ReleaseReport): string {
  const lines = [
    'laRose Release Intelligence',
    '',
    `Packages: ${report.packageCount} (${report.publishableCount} publishable)`,
    `Canonical version: ${report.canonicalVersion ?? 'n/a'}`,
    `Aligned: ${report.aligned ? 'yes' : 'no'}`,
    '',
  ];

  if (report.drift.length > 0) {
    lines.push('Version drift:');
    for (const entry of report.drift) {
      lines.push(`  ${entry.name}: ${entry.version} (expected ${entry.expected})`);
    }
    lines.push('');
  }

  const blocked = report.packages.filter((pkg) => !pkg.private && !pkg.publishReady);
  if (blocked.length > 0) {
    lines.push('Publish blockers:');
    for (const pkg of blocked) {
      lines.push(`  ${pkg.name}: ${pkg.issues.join(', ')}`);
    }
    lines.push('');
  }

  if (report.recommendations.length > 0) {
    lines.push('Recommendations:');
    for (const tip of report.recommendations) {
      lines.push(`  - ${tip}`);
    }
    lines.push('');
  }

  lines.push(report.aligned && blocked.length === 0 ? 'Result: READY' : 'Result: REVIEW');
  return lines.join('\n');
}

export function formatReleaseJson(report: ReleaseReport): string {
  return JSON.stringify(report, null, 2);
}
