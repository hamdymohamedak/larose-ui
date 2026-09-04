/**
 * Guided contribution workflow helpers for `larose contribute`.
 * Complements componentScaffold — stubs + checklist, not a sandbox-per-component generator.
 */

import { toPascalCase, type ScaffoldFile } from './componentScaffold.js';

/** Kitchen-sink scenario ids safe to hook with `--with-sandbox-hook`. */
export const SANDBOX_HOOK_TARGETS = [
  'forms',
  'overlays',
  'navigation',
  'command',
  'toast',
  'theme',
  'accelerators',
] as const;

export type SandboxHookTarget = (typeof SANDBOX_HOOK_TARGETS)[number];

/** UI adapter packages created by `--package all`. Styles CSS is created once via React. */
export const ALL_UI_PACKAGE_IDS = ['react', 'vue', 'svelte'] as const;

export const CONTRIBUTE_WORKFLOW_ORDER =
  'Core → Styles → Adapters → Vitest → Story → Sandbox (if needed) → Playwright (if critical) → Contracts → Changeset';

/** Post-scaffold checklist shown in the CLI report. */
export const CONTRIBUTE_CHECKLIST = [
  'Implement adapters (and shared core logic if behavior is framework-agnostic)',
  'Add/finish Vitest tests for cores + adapters',
  'Add Storybook story for docs / visual development (or use --with-story)',
  'If integration-critical: mount in an existing sandbox scenario (or --with-sandbox-hook)',
  'If critical user flow (portal/focus/keyboard/runtime): add Playwright in apps/sandbox-e2e',
  'Update contracts: pnpm generate:contracts',
  'Add changeset: pnpm changeset (minor for new components)',
] as const;

export const CONTRIBUTE_SANDBOX_RULES = [
  'Simple Button/Badge/Pill: Story + Vitest only — no dedicated sandbox scenario.',
  'Fits an existing layout/forms flow: add to that scenario (forms, overlays, …).',
  'Portal / focus / keyboard / runtime: real shared scenario + Playwright if critical.',
  'Never create sandbox-button / per-component sandboxes.',
] as const;

export interface ContributeExtrasOptions {
  /** Create apps/playground/stories/{Name}.stories.tsx stub */
  withStory?: boolean;
  /**
   * Append TODO mount comment to an existing kitchen-sink scenario
   * in react/vue/svelte sandboxes (e.g. forms, overlays).
   */
  sandboxHook?: SandboxHookTarget;
  /**
   * Create a new shared flow scenario id (kebab-case), not a per-component demo.
   * Wires scenarios.js + stub scenario files + App routers.
   */
  scenario?: string;
}

export interface ContributeExtrasPlan {
  files: ScaffoldFile[];
  /** Existing files to append a TODO hook comment into */
  hookTargets: Array<{ path: string; comment: string }>;
  /** App router / catalog patches for a new --scenario flow */
  scenarioWiring: Array<{
    path: string;
    kind: 'scenarios-catalog' | 'app-react' | 'app-vue' | 'app-svelte';
    scenarioId: string;
    componentName: string;
  }>;
  displayPaths: {
    story?: string;
    sandboxHook?: string[];
    scenario?: string[];
  };
  notes: string[];
}

export function isSandboxHookTarget(value: string): value is SandboxHookTarget {
  return (SANDBOX_HOOK_TARGETS as readonly string[]).includes(value);
}

export function normalizeScenarioId(raw: string): string {
  const trimmed = raw.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  if (!trimmed || !/^[a-z][a-z0-9-]*$/.test(trimmed)) {
    throw new Error(
      `Invalid --scenario id "${raw}". Use kebab-case flow ids (e.g. my-flow, focus-trap).`,
    );
  }
  if ((SANDBOX_HOOK_TARGETS as readonly string[]).includes(trimmed) || trimmed === 'home') {
    throw new Error(
      `Scenario "${trimmed}" already exists. Use --with-sandbox-hook ${trimmed} to attach a TODO hook instead.`,
    );
  }
  return trimmed;
}

export function scenarioIdToPascal(scenarioId: string): string {
  return toPascalCase(scenarioId);
}

function storyStub(name: string): string {
  return `import type { Meta, StoryObj } from '@storybook/react';
import { ${name} } from '@larose-ui/react';

const meta: Meta<typeof ${name}> = {
  title: 'Foundation/${name}',
  component: ${name},
  tags: ['autodocs', 'fw-react'],
  parameters: {
    // TODO: add laRose.crossFramework registry key when Vue+Svelte adapters exist
  },
};

export default meta;
type Story = StoryObj<typeof ${name}>;

/** TODO: replace stub args with real ${name} demos */
export const Default: Story = {
  args: {
    children: '${name}',
  },
};
`;
}

function reactScenarioStub(pascal: string, componentName: string): string {
  return `import { LaRoseProvider } from '@larose-ui/runtime-react';
// TODO: mount ${componentName} once implemented
// import { ${componentName} } from '@larose-ui/react';

export function ${pascal}Scenario() {
  return (
    <LaRoseProvider theme="light" locale="en" tenantId="sandbox">
      <div className="sbx-stage-pad sbx-stack">
        <p className="sbx-muted">
          TODO: implement ${pascal} flow and mount ${componentName} (not a per-component catalog).
        </p>
      </div>
    </LaRoseProvider>
  );
}
`;
}

function vueScenarioStub(pascal: string, componentName: string): string {
  return `<script setup lang="ts">
import { LaRoseProvider } from '@larose-ui/runtime-vue';
// TODO: mount ${componentName} once implemented
// import { ${componentName} } from '@larose-ui/vue';
</script>

<template>
  <LaRoseProvider theme="light" locale="en" tenant-id="sandbox">
    <div class="sbx-stage-pad sbx-stack">
      <p class="sbx-muted">
        TODO: implement ${pascal} flow and mount ${componentName} (not a per-component catalog).
      </p>
    </div>
  </LaRoseProvider>
</template>
`;
}

function svelteScenarioStub(pascal: string, componentName: string): string {
  return `<script lang="ts">
  import { LaRoseProvider } from '@larose-ui/runtime-svelte';
  // TODO: mount ${componentName} once implemented
  // import { ${componentName} } from '@larose-ui/svelte';
</script>

<LaRoseProvider theme="light" locale="en" tenantId="sandbox">
  <div class="sbx-stage-pad sbx-stack">
    <p class="sbx-muted">
      TODO: implement ${pascal} flow and mount ${componentName} (not a per-component catalog).
    </p>
  </div>
</LaRoseProvider>
`;
}

/** Map hook target → actual kitchen-sink scenario file paths. */
export function sandboxHookFilePaths(target: SandboxHookTarget): string[] {
  const pascal = toPascalCase(target);
  // React uses short names (Forms.tsx) matching existing kitchen sink.
  const reactShort: Record<SandboxHookTarget, string> = {
    forms: 'Forms.tsx',
    overlays: 'Overlays.tsx',
    navigation: 'Navigation.tsx',
    command: 'Command.tsx',
    toast: 'Toast.tsx',
    theme: 'Theme.tsx',
    accelerators: 'Accelerators.tsx',
  };
  return [
    `apps/sandbox-react/src/scenarios/${reactShort[target]}`,
    `apps/sandbox-vue/src/scenarios/${pascal}Scenario.vue`,
    `apps/sandbox-svelte/src/scenarios/${pascal}Scenario.svelte`,
  ];
}

export function planContributeExtras(
  componentName: string,
  options: ContributeExtrasOptions,
): ContributeExtrasPlan {
  const name = toPascalCase(componentName);
  const files: ScaffoldFile[] = [];
  const hookTargets: ContributeExtrasPlan['hookTargets'] = [];
  const scenarioWiring: ContributeExtrasPlan['scenarioWiring'] = [];
  const displayPaths: ContributeExtrasPlan['displayPaths'] = {};
  const notes: string[] = [];

  if (options.withStory) {
    const storyPath = `apps/playground/stories/${name}.stories.tsx`;
    files.push({ path: storyPath, contents: storyStub(name), role: 'other' });
    displayPaths.story = storyPath;
    notes.push(`Story stub: ${storyPath} — update quality/visual-baseline.json when ready.`);
  }

  if (options.sandboxHook) {
    if (!isSandboxHookTarget(options.sandboxHook)) {
      throw new Error(
        `Unknown sandbox hook target "${options.sandboxHook}". Use one of: ${SANDBOX_HOOK_TARGETS.join(', ')}`,
      );
    }
    const comment = `TODO: mount ${name}`;
    const paths = sandboxHookFilePaths(options.sandboxHook);
    for (const path of paths) {
      hookTargets.push({ path, comment });
    }
    displayPaths.sandboxHook = paths;
    notes.push(
      `Sandbox hook on #/${options.sandboxHook} — append "${comment}" in React/Vue/Svelte scenario files.`,
    );
  }

  if (options.scenario) {
    const scenarioId = normalizeScenarioId(options.scenario);
    const pascal = scenarioIdToPascal(scenarioId);
    const title = pascal.replace(/([a-z])([A-Z])/g, '$1 $2');

    const reactPath = `apps/sandbox-react/src/scenarios/${pascal}.tsx`;
    const vuePath = `apps/sandbox-vue/src/scenarios/${pascal}Scenario.vue`;
    const sveltePath = `apps/sandbox-svelte/src/scenarios/${pascal}Scenario.svelte`;

    files.push(
      { path: reactPath, contents: reactScenarioStub(pascal, name), role: 'other' },
      { path: vuePath, contents: vueScenarioStub(pascal, name), role: 'other' },
      { path: sveltePath, contents: svelteScenarioStub(pascal, name), role: 'other' },
    );

    scenarioWiring.push(
      {
        path: 'apps/sandbox-shared/scenarios.js',
        kind: 'scenarios-catalog',
        scenarioId,
        componentName: name,
      },
      {
        path: 'apps/sandbox-react/src/App.tsx',
        kind: 'app-react',
        scenarioId,
        componentName: pascal,
      },
      {
        path: 'apps/sandbox-vue/src/App.vue',
        kind: 'app-vue',
        scenarioId,
        componentName: pascal,
      },
      {
        path: 'apps/sandbox-svelte/src/App.svelte',
        kind: 'app-svelte',
        scenarioId,
        componentName: pascal,
      },
    );

    displayPaths.scenario = [reactPath, vuePath, sveltePath];
    notes.push(
      `New shared flow #/${scenarioId} (${title}) — kitchen-sink flow, not a ${name}-only catalog page.`,
    );
  }

  return { files, hookTargets, scenarioWiring, displayPaths, notes };
}

export function formatContributeChecklist(): string[] {
  return [
    'Contributor checklist:',
    ...CONTRIBUTE_CHECKLIST.map((item) => `  [ ] ${item}`),
    '',
    'Sandbox rule of thumb:',
    ...CONTRIBUTE_SANDBOX_RULES.map((item) => `  • ${item}`),
    '',
    `Workflow: ${CONTRIBUTE_WORKFLOW_ORDER}`,
  ];
}

export function resolvePackageIds(packageId: string): string[] {
  const id = packageId.trim().toLowerCase();
  if (id === 'all') {
    return [...ALL_UI_PACKAGE_IDS];
  }
  return [packageId];
}
