/**
 * Reverse a `larose contribute` scaffold using the same path plan used to create it.
 * Only touches contribute locations (unit folders, barrels, changelogs, optional extras).
 */

import { dirname } from 'node:path';
import { color } from './cliColor.js';
import {
  planComponentScaffold,
  toCamelCase,
  toPascalCase,
  type ScaffoldPlan,
} from './componentScaffold.js';
import {
  planContributeExtras,
  sandboxHookFilePaths,
  SANDBOX_HOOK_TARGETS,
  type ContributeExtrasOptions,
  type ContributeExtrasPlan,
} from './contributeWorkflow.js';

const REMOVABLE_PREFIXES = [
  /^packages\/[^/]+\//,
  /^apps\/playground\/stories\//,
  /^apps\/sandbox-react\//,
  /^apps\/sandbox-vue\//,
  /^apps\/sandbox-svelte\//,
  /^apps\/sandbox-shared\//,
];

export interface ContributeRemovalPlan {
  name: string;
  packageIds: string[];
  /** Unit directories named after the component (deleted recursively). */
  directories: string[];
  /** Loose files not inside a unit directory (e.g. planned module files). */
  files: string[];
  /** Story / scenario stubs — removed if present, omitted from "not found". */
  optionalFiles: string[];
  indexUpdates: Array<{ path: string; exportLines: string[] }>;
  changelog: Array<{ packageId: string; message: string }>;
  hookStrips: Array<{ path: string; comment: string }>;
  scenarioWiring: ContributeExtrasPlan['scenarioWiring'];
  notes: string[];
}

export function assertRemovableContributePath(relPath: string): void {
  const normalized = relPath.replace(/\\/g, '/');
  if (!REMOVABLE_PREFIXES.some((re) => re.test(normalized))) {
    throw new Error(`Refusing to remove path outside contribute locations: ${relPath}`);
  }
}

export function stripIndexExportLines(source: string, exportLines: string[]): string {
  let next = source;
  for (const line of exportLines) {
    if (!line) continue;
    const escaped = line.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    next = next.replace(new RegExp(`\\n${escaped}`, 'g'), '');
    next = next.replace(new RegExp(`${escaped}\\n`, 'g'), '');
  }
  return next.replace(/\n{3,}/g, '\n\n').replace(/[ \t]+\n/g, '\n').replace(/\s*$/, '\n');
}

export function removeScaffoldChangelogBullet(existing: string, name: string): string {
  const safe = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const bullet = new RegExp(`^- Scaffolded ${safe}\\b.*$`);
  const lines = existing.split('\n');
  const start = lines.findIndex((l) => l === '## Unreleased');
  if (start < 0) {
    return lines.filter((l) => !bullet.test(l)).join('\n');
  }
  let end = lines.findIndex((l, i) => i > start && /^## /.test(l));
  if (end < 0) end = lines.length;
  const next = [
    ...lines.slice(0, start),
    ...lines.slice(start, end).filter((l) => !bullet.test(l)),
    ...lines.slice(end),
  ];
  return next.join('\n');
}

export function stripScenarioWiring(
  content: string,
  wire: ContributeExtrasPlan['scenarioWiring'][number],
): string {
  const { scenarioId, componentName } = wire;
  if (wire.kind === 'scenarios-catalog') {
    return content.replace(
      new RegExp(
        `\\n  \\{\\n    id: '${scenarioId}',\\n    title: '[^']*',\\n    description: '[^']*',\\n  },`,
      ),
      '',
    );
  }
  if (wire.kind === 'app-react') {
    return content
      .replace(`import { ${componentName}Scenario } from './scenarios/${componentName}';\n`, '')
      .replace(`      case '${scenarioId}':\n        return <${componentName}Scenario />;\n`, '');
  }
  if (wire.kind === 'app-vue') {
    return content
      .replace(`import ${componentName}Scenario from './scenarios/${componentName}Scenario.vue';\n`, '')
      .replace(`        <${componentName}Scenario v-else-if="route === '${scenarioId}'" />\n`, '');
  }
  if (wire.kind === 'app-svelte') {
    return content
      .replace(`  import ${componentName}Scenario from './scenarios/${componentName}Scenario.svelte';\n`, '')
      .replace(`      {:else if route === '${scenarioId}'}\n        <${componentName}Scenario />\n`, '');
  }
  return content;
}

export function stripSandboxHookComment(content: string, comment: string): string {
  const variants = [
    `\n{/* ${comment} */}\n`,
    `\n<!-- ${comment} -->\n`,
    `\n/* ${comment} */\n`,
    `{/* ${comment} */}`,
    `<!-- ${comment} -->`,
    `/* ${comment} */`,
  ];
  let next = content;
  for (const variant of variants) {
    next = next.split(variant).join('\n');
  }
  return next.replace(/\n{3,}/g, '\n\n');
}

function unitDirectoryFor(filePath: string, name: string): string | undefined {
  const dir = dirname(filePath).replace(/\\/g, '/');
  const base = dir.split('/').pop();
  const camel = toCamelCase(name);
  if (base === name || base === camel) return dir;
  return undefined;
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}

function collectFromPlan(plan: ScaffoldPlan): {
  directories: string[];
  files: string[];
  indexUpdates: ContributeRemovalPlan['indexUpdates'];
  changelog: ContributeRemovalPlan['changelog'];
} {
  const directories: string[] = [];
  const files: string[] = [];
  for (const file of plan.files) {
    const unit = unitDirectoryFor(file.path, plan.name);
    if (unit) directories.push(unit);
    else files.push(file.path);
  }
  return {
    directories: unique(directories),
    files: unique(files),
    indexUpdates: plan.indexUpdates,
    changelog: plan.changelogPackages.map((packageId) => ({
      packageId,
      message: plan.changelogMessage,
    })),
  };
}

/**
 * Build a removal plan from the same scaffold paths contribute uses to create files.
 * Optional extras (story / sandbox hook / scenario) are discovered by name, not only when flags were used.
 */
export function planContributeRemoval(
  packageIds: string[],
  rawName: string,
  options: {
    packageJsonById?: Record<string, { name?: string; scripts?: Record<string, string> }>;
    skipStyles?: boolean;
    extras?: ContributeExtrasOptions;
  } = {},
): ContributeRemovalPlan {
  const name = toPascalCase(rawName);
  if (!name || !/^[A-Z][A-Za-z0-9]*$/.test(name)) {
    throw new Error(`Invalid component name "${rawName}". Use PascalCase (e.g. StatusPill).`);
  }

  const directories: string[] = [];
  const files: string[] = [];
  const indexUpdates: ContributeRemovalPlan['indexUpdates'] = [];
  const changelog: ContributeRemovalPlan['changelog'] = [];
  const notes: string[] = [];

  for (let i = 0; i < packageIds.length; i++) {
    const id = packageIds[i]!;
    const skipStyles = options.skipStyles || (packageIds.length > 1 && i > 0);
    const plan = planComponentScaffold(id, name, {
      packageJson: options.packageJsonById?.[id],
      skipStyles,
    });
    const collected = collectFromPlan(plan);
    directories.push(...collected.directories);
    files.push(...collected.files);
    indexUpdates.push(...collected.indexUpdates);
    changelog.push(...collected.changelog);
  }

  const extras = planContributeExtras(name, {
    withStory: true,
    ...options.extras,
  });
  // Always target the Storybook stub for this name (created by default on contribute).
  const storyPath = `apps/playground/stories/${name}.stories.tsx`;
  const optionalFiles = unique([...extras.files.map((f) => f.path), storyPath]);

  const hookStrips: ContributeRemovalPlan['hookStrips'] = [];
  const hookTargets = options.extras?.sandboxHook
    ? extras.hookTargets
    : SANDBOX_HOOK_TARGETS.flatMap((target) =>
        sandboxHookFilePaths(target).map((path) => ({
          path,
          comment: `TODO: mount ${name}`,
        })),
      );
  hookStrips.push(...hookTargets);

  for (const path of [...directories, ...files, ...optionalFiles, ...indexUpdates.map((u) => u.path)]) {
    assertRemovableContributePath(path);
  }
  for (const hook of hookStrips) {
    assertRemovableContributePath(hook.path);
  }

  notes.push(
    'Looks up the same paths contribute creates (adapter folder, styles, Storybook story, barrel exports, changelog).',
    `Removes Storybook stub if present: ${storyPath}`,
    'Does not delete unrelated namesakes (e.g. ActivityView when removing Activity).',
  );

  return {
    name,
    packageIds,
    directories: unique(directories),
    files: unique(files),
    optionalFiles: unique(optionalFiles),
    indexUpdates,
    changelog,
    hookStrips,
    scenarioWiring: options.extras?.scenario ? extras.scenarioWiring : [],
    notes,
  };
}

export function formatContributeRemoveReport(input: {
  name: string;
  packageIds: string[];
  deleted: string[];
  updated: string[];
  skipped: string[];
  kept: string[];
  dryRun?: boolean;
}): string {
  const lines = [
    input.dryRun
      ? color.yellow(`[dry-run] Would remove ${input.name} from ${input.packageIds.join(', ')}`)
      : color.success(`✓ Removed ${input.name} from ${input.packageIds.join(', ')}`),
    '',
  ];

  const storyDeleted = input.deleted.filter((p) => p.includes('/stories/') && p.endsWith('.stories.tsx'));
  const otherDeleted = input.deleted.filter((p) => !storyDeleted.includes(p));

  if (otherDeleted.length) {
    lines.push(
      color.heading(input.dryRun ? 'Would delete:' : 'Deleted:'),
      ...otherDeleted.map((p) => `  - ${color.yellow(p)}`),
      '',
    );
  }
  if (storyDeleted.length) {
    lines.push(
      color.heading(input.dryRun ? 'Would delete Storybook:' : 'Deleted Storybook:'),
      ...storyDeleted.map((p) => `  - ${color.yellow(p)}`),
      '',
    );
  }
  if (input.updated.length) {
    lines.push(
      color.heading(input.dryRun ? 'Would update:' : 'Updated:'),
      ...input.updated.map((p) => `  - ${color.cyan(p)}`),
      '',
    );
  }
  if (input.kept.length) {
    lines.push(
      color.heading('Kept (other adapters still use it):'),
      ...input.kept.map((p) => `  - ${color.dim(p)}`),
      '',
    );
  }
  if (input.skipped.length) {
    lines.push(
      color.heading('Not found (already gone):'),
      ...input.skipped.map((p) => `  - ${color.dim(p)}`),
      '',
    );
  }

  return lines.join('\n').trimEnd();
}
