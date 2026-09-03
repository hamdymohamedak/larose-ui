import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import {
  appendChangelogUnreleased,
  formatContributeReport,
  formatPackageList,
  planComponentScaffold,
  resolvePackageProfile,
  type ScaffoldPlan,
} from '@larose-ui/migration';

async function pathExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function ensureDir(filePath: string): Promise<void> {
  await mkdir(dirname(filePath), { recursive: true });
}

export interface ContributeOptions {
  dryRun?: boolean;
  skipStyles?: boolean;
  skipChangelog?: boolean;
  skipIndex?: boolean;
}

export interface ContributeResult {
  plan: ScaffoldPlan;
  created: string[];
  skipped: string[];
  report: string;
}

/**
 * Inspect package layout before scaffolding. Throws if the package or required roots are missing,
 * or if the target unit already exists.
 */
export async function assertPackageStructure(
  rootDir: string,
  packageId: string,
  plan: ScaffoldPlan,
): Promise<void> {
  const packageDir = join(rootDir, 'packages', packageId);
  if (!(await pathExists(packageDir))) {
    throw new Error(
      `Package not found: packages/${packageId}. Run \`larose contribute list\` for known targets.`,
    );
  }

  const pkgJsonPath = join(packageDir, 'package.json');
  if (!(await pathExists(pkgJsonPath))) {
    throw new Error(`Missing package.json in packages/${packageId}`);
  }

  const profile = resolvePackageProfile(packageId);
  const sourceRoot = join(packageDir, profile.sourceRoot);
  if (!(await pathExists(sourceRoot))) {
    throw new Error(
      `Expected source root missing: packages/${packageId}/${profile.sourceRoot}`,
    );
  }

  if (profile.framework !== 'styles') {
    const indexPath = join(packageDir, profile.indexPath);
    if (!(await pathExists(indexPath))) {
      throw new Error(
        `Expected barrel export missing: packages/${packageId}/${profile.indexPath}`,
      );
    }
  }

  if (plan.displayPaths.styles) {
    const stylesRoot = join(rootDir, 'packages/styles/src/components');
    if (!(await pathExists(stylesRoot))) {
      throw new Error('Expected styles components root missing: packages/styles/src/components');
    }
  }

  for (const file of plan.files) {
    const abs = join(rootDir, file.path);
    if (await pathExists(abs)) {
      throw new Error(`Refusing to overwrite existing file: ${file.path}`);
    }
  }
}

async function loadPackageJson(
  rootDir: string,
  packageId: string,
): Promise<{ name?: string; scripts?: Record<string, string> }> {
  const raw = await readFile(join(rootDir, 'packages', packageId, 'package.json'), 'utf-8');
  return JSON.parse(raw) as { name?: string; scripts?: Record<string, string> };
}

async function appendIndexExports(
  rootDir: string,
  update: { path: string; exportLines: string[] },
): Promise<void> {
  if (update.exportLines.length === 0) return;
  const abs = join(rootDir, update.path);
  const current = await readFile(abs, 'utf-8');
  for (const line of update.exportLines) {
    if (current.includes(line)) {
      throw new Error(`Export already present in ${update.path}: ${line}`);
    }
  }
  const trimmed = current.replace(/\s*$/, '');
  const next = `${trimmed}\n\n${update.exportLines.join('\n')}\n`;
  await writeFile(abs, next);
}

async function updateChangelog(
  rootDir: string,
  packageId: string,
  message: string,
): Promise<string> {
  const changelogPath = join(rootDir, 'packages', packageId, 'CHANGELOG.md');
  let existing = '';
  if (await pathExists(changelogPath)) {
    existing = await readFile(changelogPath, 'utf-8');
  } else {
    existing = `# @larose-ui/${packageId}\n`;
  }
  const next = appendChangelogUnreleased(existing, message);
  await writeFile(changelogPath, next);
  return `packages/${packageId}/CHANGELOG.md`;
}

export async function runContributeComponent(
  rootDir: string,
  packageId: string,
  name: string,
  options: ContributeOptions = {},
): Promise<ContributeResult> {
  const packageJson = await loadPackageJson(rootDir, packageId).catch(() => undefined);
  const plan = planComponentScaffold(packageId, name, {
    packageJson,
    skipStyles: options.skipStyles,
  });

  await assertPackageStructure(rootDir, packageId, plan);

  const created: string[] = [];
  const skipped: string[] = [];

  if (options.dryRun) {
    return {
      plan,
      created: plan.files.map((f) => f.path),
      skipped: [],
      report: [
        `[dry-run] Would scaffold ${plan.name} in ${plan.npmName}`,
        '',
        ...plan.files.map((f) => `  - ${f.path}`),
        '',
        formatContributeReport(plan, plan.files.map((f) => f.path)),
      ].join('\n'),
    };
  }

  for (const file of plan.files) {
    const abs = join(rootDir, file.path);
    await ensureDir(abs);
    await writeFile(abs, file.contents);
    created.push(file.path);
  }

  if (!options.skipIndex) {
    for (const update of plan.indexUpdates) {
      await appendIndexExports(rootDir, update);
      created.push(update.path);
    }
  } else {
    skipped.push(...plan.indexUpdates.map((u) => u.path));
  }

  if (!options.skipChangelog) {
    for (const pkg of plan.changelogPackages) {
      const path = await updateChangelog(rootDir, pkg, plan.changelogMessage);
      created.push(path);
    }
  } else {
    skipped.push(...plan.changelogPackages.map((p) => `packages/${p}/CHANGELOG.md`));
  }

  return {
    plan,
    created,
    skipped,
    report: formatContributeReport(plan, created),
  };
}

export function contributeListReport(): string {
  return formatPackageList();
}
