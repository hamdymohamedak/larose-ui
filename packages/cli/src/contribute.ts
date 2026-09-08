import { access, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import {
  ALL_UI_PACKAGE_IDS,
  appendChangelogUnreleased,
  color,
  formatContributeChecklist,
  formatContributeReport,
  formatContributeRemoveReport,
  formatCreatedFilesSection,
  formatDisplayPathsSection,
  formatNextStepsSection,
  formatPackageList,
  isSandboxHookTarget,
  planComponentScaffold,
  planContributeExtras,
  planContributeRemoval,
  removeScaffoldChangelogBullet,
  resolvePackageIds,
  resolvePackageProfile,
  shouldScaffoldStory,
  stripIndexExportLines,
  stripSandboxHookComment,
  stripScenarioWiring,
  toPascalCase,
  type ContributeExtrasOptions,
  type ContributeExtrasPlan,
  type SandboxHookTarget,
  type ScaffoldPlan,
} from '@larose-ui/migration';
import { resolveSafePath } from './pathSafety.js';

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
  /** Force Storybook stub (default already on for react/all) */
  withStory?: boolean;
  /** Skip the default Storybook stub */
  skipStory?: boolean;
  /** Existing kitchen-sink scenario id (forms, overlays, …) */
  sandboxHook?: string;
  /** New shared flow scenario id (kebab-case) */
  scenario?: string;
}

export interface ContributeResult {
  plan: ScaffoldPlan;
  plans: ScaffoldPlan[];
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

function parseExtrasOptions(
  options: ContributeOptions,
  packageIds: string[],
): ContributeExtrasOptions {
  const extras: ContributeExtrasOptions = {};
  if (shouldScaffoldStory(packageIds, options)) {
    extras.withStory = true;
  }
  if (options.sandboxHook) {
    if (!isSandboxHookTarget(options.sandboxHook)) {
      throw new Error(
        `Unknown --with-sandbox-hook target "${options.sandboxHook}". Use forms|overlays|navigation|command|toast|theme|accelerators.`,
      );
    }
    extras.sandboxHook = options.sandboxHook as SandboxHookTarget;
  }
  if (options.scenario) extras.scenario = options.scenario;
  return extras;
}

function commentForPath(path: string, comment: string): string {
  if (path.endsWith('.tsx') || path.endsWith('.ts')) {
    return `\n{/* ${comment} */}\n`;
  }
  if (path.endsWith('.vue')) {
    return `\n<!-- ${comment} -->\n`;
  }
  if (path.endsWith('.svelte')) {
    return `\n<!-- ${comment} -->\n`;
  }
  return `\n/* ${comment} */\n`;
}

async function applySandboxHooks(
  rootDir: string,
  extras: ContributeExtrasPlan,
  dryRun: boolean,
): Promise<string[]> {
  const touched: string[] = [];
  for (const hook of extras.hookTargets) {
    const abs = join(rootDir, hook.path);
    if (!(await pathExists(abs))) {
      throw new Error(`Sandbox hook target missing: ${hook.path}`);
    }
    const current = await readFile(abs, 'utf-8');
    if (current.includes(hook.comment)) {
      continue;
    }
    if (!dryRun) {
      await writeFile(abs, `${current.replace(/\s*$/, '')}${commentForPath(hook.path, hook.comment)}`);
    }
    touched.push(hook.path);
  }
  return touched;
}

async function applyScenarioWiring(
  rootDir: string,
  extras: ContributeExtrasPlan,
  dryRun: boolean,
): Promise<string[]> {
  const touched: string[] = [];
  for (const wire of extras.scenarioWiring) {
    const abs = join(rootDir, wire.path);
    if (!(await pathExists(abs))) {
      throw new Error(`Scenario wiring target missing: ${wire.path}`);
    }
    let current = await readFile(abs, 'utf-8');
    const { scenarioId, componentName } = wire;

    if (wire.kind === 'scenarios-catalog') {
      if (current.includes(`id: '${scenarioId}'`)) {
        throw new Error(`Scenario id already present in ${wire.path}: ${scenarioId}`);
      }
      const title = toPascalCase(scenarioId).replace(/([a-z])([A-Z])/g, '$1 $2');
      const entry = `  {
    id: '${scenarioId}',
    title: '${title}',
    description: 'TODO: describe this shared flow (mount ${wire.componentName} when ready).',
  },`;
      if (!/export const SCENARIOS = \[/.test(current)) {
        throw new Error(`Could not find SCENARIOS array in ${wire.path}`);
      }
      // Insert before the closing of SCENARIOS (before SANDBOX_PORTS export).
      const portsIdx = current.indexOf('export const SANDBOX_PORTS');
      if (portsIdx < 0) {
        throw new Error(`Could not find SANDBOX_PORTS in ${wire.path}`);
      }
      const beforePorts = current.slice(0, portsIdx);
      const closeIdx = beforePorts.lastIndexOf('];');
      if (closeIdx < 0) {
        throw new Error(`Could not find end of SCENARIOS in ${wire.path}`);
      }
      current =
        beforePorts.slice(0, closeIdx) +
        `${entry}\n` +
        beforePorts.slice(closeIdx) +
        current.slice(portsIdx);
    } else if (wire.kind === 'app-react') {
      const importLine = `import { ${componentName}Scenario } from './scenarios/${componentName}';`;
      if (!current.includes(importLine)) {
        current = current.replace(
          /(import \{ AcceleratorsScenario \} from '\.\/scenarios\/Accelerators';\n)/,
          `$1${importLine}\n`,
        );
      }
      if (!current.includes(`case '${scenarioId}':`)) {
        current = current.replace(
          /(case 'accelerators':\n\s+return <AcceleratorsScenario \/>;\n)/,
          `$1      case '${scenarioId}':\n        return <${componentName}Scenario />;\n`,
        );
      }
    } else if (wire.kind === 'app-vue') {
      const importLine = `import ${componentName}Scenario from './scenarios/${componentName}Scenario.vue';`;
      if (!current.includes(importLine)) {
        current = current.replace(
          /(import AcceleratorsScenario from '\.\/scenarios\/AcceleratorsScenario\.vue';\n)/,
          `$1${importLine}\n`,
        );
      }
      if (!current.includes(`route === '${scenarioId}'`)) {
        current = current.replace(
          /(<AcceleratorsScenario v-else-if="route === 'accelerators'" \/>\n)/,
          `$1        <${componentName}Scenario v-else-if="route === '${scenarioId}'" />\n`,
        );
      }
    } else if (wire.kind === 'app-svelte') {
      const importLine = `  import ${componentName}Scenario from './scenarios/${componentName}Scenario.svelte';`;
      if (!current.includes(`${componentName}Scenario`)) {
        current = current.replace(
          /(import AcceleratorsScenario from '\.\/scenarios\/AcceleratorsScenario\.svelte';\n)/,
          `$1${importLine}\n`,
        );
      }
      if (!current.includes(`route === '${scenarioId}'`)) {
        current = current.replace(
          /({:else if route === 'accelerators'}\n\s+<AcceleratorsScenario \/>\n)/,
          `$1      {:else if route === '${scenarioId}'}\n        <${componentName}Scenario />\n`,
        );
      }
    }

    if (!dryRun) {
      await writeFile(abs, current);
    }
    touched.push(wire.path);
  }
  return touched;
}

async function writePlanFiles(
  rootDir: string,
  plan: ScaffoldPlan,
  options: ContributeOptions,
): Promise<{ created: string[]; skipped: string[] }> {
  const created: string[] = [];
  const skipped: string[] = [];

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

  return { created, skipped };
}

function buildReport(
  plans: ScaffoldPlan[],
  created: string[],
  extrasNotes: string[],
  storyPath?: string,
): string {
  const primary = plans[0]!;
  if (plans.length === 1) {
    return formatContributeReport(primary, created, {
      extrasNotes,
      storyPath,
      appendix: formatContributeChecklist(),
    });
  }

  const header = [
    color.success(
      `✓ Scaffolded ${primary.name} across ${plans.map((p) => p.packageId).join(', ')} (guided parity)`,
    ),
    '',
    ...formatCreatedFilesSection(created),
    '',
  ];

  for (const plan of plans) {
    header.push(color.heading(`Package @larose-ui/${plan.packageId}:`));
    header.push(...formatDisplayPathsSection(plan.displayPaths).map((line) => `  ${line}`));
    header.push('');
  }

  if (storyPath) {
    header.push(`${color.cyan('Story:')} ${color.green(storyPath)}`, '');
  }

  header.push(...formatNextStepsSection(primary.nextSteps));
  if (extrasNotes.length) {
    header.push(
      '',
      color.heading(storyPath ? 'Storybook preview:' : 'Extras:'),
      ...extrasNotes.map((s) => `  ${color.yellow('•')} ${s}`),
    );
  }
  header.push('', ...formatContributeChecklist());
  return header.join('\n');
}

/**
 * Guided contribute workflow: package scaffolds (+ optional story/sandbox extras).
 * `packageId === 'all'` scaffolds React + Vue + Svelte with shared CSS once.
 */
export async function runContributeComponent(
  rootDir: string,
  packageId: string,
  name: string,
  options: ContributeOptions = {},
): Promise<ContributeResult> {
  const packageIds = resolvePackageIds(packageId);
  const extrasOpts = parseExtrasOptions(options, packageIds);
  const extras = planContributeExtras(name, extrasOpts);

  const plans: ScaffoldPlan[] = [];
  for (let i = 0; i < packageIds.length; i++) {
    const id = packageIds[i]!;
    const packageJson = await loadPackageJson(rootDir, id).catch(() => undefined);
    // Shared CSS once when scaffolding all UI adapters.
    const skipStyles = options.skipStyles || (packageIds.length > 1 && i > 0);
    const plan = planComponentScaffold(id, name, {
      packageJson,
      skipStyles,
    });
    await assertPackageStructure(rootDir, id, plan);
    plans.push(plan);
  }

  for (const file of extras.files) {
    const abs = join(rootDir, file.path);
    if (await pathExists(abs)) {
      throw new Error(`Refusing to overwrite existing file: ${file.path}`);
    }
  }

  const created: string[] = [];
  const skipped: string[] = [];

  if (options.dryRun) {
    const wouldCreate = [
      ...plans.flatMap((p) => p.files.map((f) => f.path)),
      ...extras.files.map((f) => f.path),
      ...extras.hookTargets.map((h) => h.path),
      ...extras.scenarioWiring.map((w) => w.path),
    ];
    return {
      plan: plans[0]!,
      plans,
      created: wouldCreate,
      skipped: [],
      report: [
        color.yellow(`[dry-run] Would scaffold ${plans[0]!.name} for: ${packageIds.join(', ')}`),
        '',
        ...wouldCreate.map((p) => `  - ${color.green(p)}`),
        '',
        buildReport(plans, wouldCreate, extras.notes, extras.displayPaths.story),
      ].join('\n'),
    };
  }

  for (const plan of plans) {
    const result = await writePlanFiles(rootDir, plan, options);
    created.push(...result.created);
    skipped.push(...result.skipped);
  }

  for (const file of extras.files) {
    const abs = join(rootDir, file.path);
    await ensureDir(abs);
    await writeFile(abs, file.contents);
    created.push(file.path);
  }

  const hooked = await applySandboxHooks(rootDir, extras, false);
  created.push(...hooked);

  const wired = await applyScenarioWiring(rootDir, extras, false);
  created.push(...wired);

  return {
    plan: plans[0]!,
    plans,
    created,
    skipped,
    report: buildReport(plans, created, extras.notes, extras.displayPaths.story),
  };
}

export function contributeListReport(): string {
  return formatPackageList();
}

export interface ContributeRemoveOptions {
  dryRun?: boolean;
  skipStyles?: boolean;
  sandboxHook?: string;
  scenario?: string;
}

export interface ContributeRemoveResult {
  deleted: string[];
  updated: string[];
  skipped: string[];
  kept: string[];
  report: string;
}

function isStylesPath(rel: string): boolean {
  return rel.replace(/\\/g, '/').startsWith('packages/styles/');
}

async function adapterComponentExists(
  rootDir: string,
  packageId: string,
  name: string,
): Promise<boolean> {
  const packageJson = await loadPackageJson(rootDir, packageId).catch(() => undefined);
  const plan = planComponentScaffold(packageId, name, {
    packageJson,
    skipStyles: true,
  });
  const component = plan.displayPaths.component;
  return Boolean(component && (await pathExists(join(rootDir, component))));
}

/**
 * Undo a contribute scaffold: delete the named unit folders, strip barrel exports and
 * changelog bullets, and clean optional extras (story / sandbox hook / scenario) if present.
 */
export async function runContributeRemove(
  rootDir: string,
  packageId: string,
  name: string,
  options: ContributeRemoveOptions = {},
): Promise<ContributeRemoveResult> {
  const packageIds = resolvePackageIds(packageId);
  const extrasOpts = parseExtrasOptions(
    {
      sandboxHook: options.sandboxHook,
      scenario: options.scenario,
      withStory: true,
    },
    packageIds,
  );

  const packageJsonById: Record<string, { name?: string; scripts?: Record<string, string> }> = {};
  for (const id of packageIds) {
    const json = await loadPackageJson(rootDir, id).catch(() => undefined);
    if (json) packageJsonById[id] = json;
  }

  const plan = planContributeRemoval(packageIds, name, {
    packageJsonById,
    skipStyles: options.skipStyles,
    extras: extrasOpts,
  });

  const otherAdapters = ALL_UI_PACKAGE_IDS.filter((id) => !packageIds.includes(id));
  let keepStyles = Boolean(options.skipStyles);
  if (!keepStyles) {
    for (const id of otherAdapters) {
      if (await adapterComponentExists(rootDir, id, plan.name)) {
        keepStyles = true;
        break;
      }
    }
  }

  const kept: string[] = [];
  let directories = plan.directories;
  let files = [...plan.files, ...plan.optionalFiles];
  let changelog = plan.changelog;
  if (keepStyles) {
    kept.push(...directories.filter(isStylesPath).map((d) => `${d}/`));
    directories = directories.filter((d) => !isStylesPath(d));
    files = files.filter((f) => !isStylesPath(f));
    changelog = changelog.filter((c) => c.packageId !== 'styles');
  }

  const optional = new Set(plan.optionalFiles);
  const deleted: string[] = [];
  const updated: string[] = [];
  const skipped: string[] = [];

  const existingDirs: string[] = [];
  for (const dir of directories) {
    const abs = resolveSafePath(rootDir, dir);
    if (await pathExists(abs)) existingDirs.push(dir);
    else skipped.push(`${dir}/`);
  }

  const existingFiles: string[] = [];
  for (const file of files) {
    const normalized = file.replace(/\\/g, '/');
    if (existingDirs.some((d) => normalized === d || normalized.startsWith(`${d}/`))) {
      continue;
    }
    const abs = resolveSafePath(rootDir, file);
    if (await pathExists(abs)) existingFiles.push(file);
    else if (!optional.has(file)) skipped.push(file);
  }

  for (const update of plan.indexUpdates) {
    const abs = resolveSafePath(rootDir, update.path);
    if (!(await pathExists(abs))) {
      skipped.push(update.path);
      continue;
    }
    const current = await readFile(abs, 'utf-8');
    const next = stripIndexExportLines(current, update.exportLines);
    if (next === current) {
      skipped.push(update.path);
      continue;
    }
    updated.push(update.path);
    if (!options.dryRun) await writeFile(abs, next);
  }

  for (const entry of changelog) {
    const rel = `packages/${entry.packageId}/CHANGELOG.md`;
    const abs = resolveSafePath(rootDir, rel);
    if (!(await pathExists(abs))) {
      skipped.push(rel);
      continue;
    }
    const current = await readFile(abs, 'utf-8');
    const next = removeScaffoldChangelogBullet(current, plan.name);
    if (next === current) {
      skipped.push(rel);
      continue;
    }
    updated.push(rel);
    if (!options.dryRun) await writeFile(abs, next);
  }

  for (const hook of plan.hookStrips) {
    const abs = resolveSafePath(rootDir, hook.path);
    if (!(await pathExists(abs))) continue;
    const current = await readFile(abs, 'utf-8');
    if (!current.includes(hook.comment)) continue;
    const next = stripSandboxHookComment(current, hook.comment);
    if (next === current) continue;
    updated.push(hook.path);
    if (!options.dryRun) await writeFile(abs, next);
  }

  for (const wire of plan.scenarioWiring) {
    const abs = resolveSafePath(rootDir, wire.path);
    if (!(await pathExists(abs))) continue;
    const current = await readFile(abs, 'utf-8');
    const next = stripScenarioWiring(current, wire);
    if (next === current) continue;
    updated.push(wire.path);
    if (!options.dryRun) await writeFile(abs, next);
  }

  if (!options.dryRun) {
    for (const file of existingFiles) {
      await rm(resolveSafePath(rootDir, file));
    }
    for (const dir of existingDirs) {
      await rm(resolveSafePath(rootDir, dir), { recursive: true, force: true });
    }
  }

  deleted.push(...existingDirs.map((d) => `${d}/`), ...existingFiles);

  if (deleted.length === 0 && updated.length === 0) {
    throw new Error(
      `Nothing to remove for ${plan.name} in ${packageIds.join(', ')}. Run \`make contribute-list\` for targets.`,
    );
  }

  return {
    deleted,
    updated,
    skipped,
    kept,
    report: formatContributeRemoveReport({
      name: plan.name,
      packageIds,
      deleted,
      updated,
      skipped,
      kept,
      dryRun: options.dryRun,
    }),
  };
}
