import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { assertPackageStructure, runContributeComponent } from './contribute';
import { planComponentScaffold } from '@larose-ui/migration';

async function fakeMonorepo(opts: { withVueSvelte?: boolean; withSandbox?: boolean } = {}): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), 'larose-contribute-'));
  await mkdir(join(root, 'packages/react/src'), { recursive: true });
  await mkdir(join(root, 'packages/styles/src/components'), { recursive: true });
  await writeFile(
    join(root, 'packages/react/package.json'),
    JSON.stringify({ name: '@larose-ui/react', scripts: { build: 'tsup', test: 'vitest' } }),
  );
  await writeFile(join(root, 'packages/react/src/index.ts'), 'export {};\n');
  await writeFile(
    join(root, 'packages/react/CHANGELOG.md'),
    '# @larose-ui/react\n\n## 0.2.0\n\n### Minor Changes\n\n- baseline\n',
  );
  await writeFile(
    join(root, 'packages/styles/package.json'),
    JSON.stringify({ name: '@larose-ui/styles' }),
  );
  await writeFile(
    join(root, 'packages/styles/CHANGELOG.md'),
    '# @larose-ui/styles\n\n## 0.2.0\n\n### Minor Changes\n\n- baseline\n',
  );

  if (opts.withVueSvelte) {
    await mkdir(join(root, 'packages/vue/src/components'), { recursive: true });
    await mkdir(join(root, 'packages/svelte/src/lib/components'), { recursive: true });
    await writeFile(
      join(root, 'packages/vue/package.json'),
      JSON.stringify({ name: '@larose-ui/vue' }),
    );
    await writeFile(join(root, 'packages/vue/src/index.ts'), 'export {};\n');
    await writeFile(join(root, 'packages/vue/CHANGELOG.md'), '# @larose-ui/vue\n');
    await writeFile(
      join(root, 'packages/svelte/package.json'),
      JSON.stringify({ name: '@larose-ui/svelte' }),
    );
    await writeFile(join(root, 'packages/svelte/src/lib/index.ts'), 'export {};\n');
    await writeFile(join(root, 'packages/svelte/CHANGELOG.md'), '# @larose-ui/svelte\n');
  }

  if (opts.withSandbox) {
    await mkdir(join(root, 'apps/playground/stories'), { recursive: true });
    await mkdir(join(root, 'apps/sandbox-react/src/scenarios'), { recursive: true });
    await mkdir(join(root, 'apps/sandbox-vue/src/scenarios'), { recursive: true });
    await mkdir(join(root, 'apps/sandbox-svelte/src/scenarios'), { recursive: true });
    await mkdir(join(root, 'apps/sandbox-shared'), { recursive: true });
    await writeFile(
      join(root, 'apps/sandbox-react/src/scenarios/Forms.tsx'),
      'export function FormsScenario() { return null; }\n',
    );
    await writeFile(
      join(root, 'apps/sandbox-vue/src/scenarios/FormsScenario.vue'),
      '<template><div /></template>\n',
    );
    await writeFile(
      join(root, 'apps/sandbox-svelte/src/scenarios/FormsScenario.svelte'),
      '<div></div>\n',
    );
    await writeFile(
      join(root, 'apps/sandbox-shared/scenarios.js'),
      `export const SCENARIOS = [
  { id: 'home', title: 'Home', description: 'x' },
  { id: 'forms', title: 'Forms', description: 'x' },
  { id: 'accelerators', title: 'Accelerators', description: 'x' },
];

/** Ports used by Playwright */
export const SANDBOX_PORTS = { react: 5173, vue: 5174, svelte: 5175 };
`,
    );
    await writeFile(
      join(root, 'apps/sandbox-react/src/App.tsx'),
      `import { AcceleratorsScenario } from './scenarios/Accelerators';

export function App() {
  const route = 'home';
  switch (route) {
    case 'accelerators':
      return <AcceleratorsScenario />;
    default:
      return null;
  }
}
`,
    );
    await writeFile(
      join(root, 'apps/sandbox-vue/src/App.vue'),
      `<script setup>
import AcceleratorsScenario from './scenarios/AcceleratorsScenario.vue';
const route = 'home';
</script>
<template>
  <AcceleratorsScenario v-else-if="route === 'accelerators'" />
  <div v-else />
</template>
`,
    );
    await writeFile(
      join(root, 'apps/sandbox-svelte/src/App.svelte'),
      `<script>
  import AcceleratorsScenario from './scenarios/AcceleratorsScenario.svelte';
  let route = 'home';
</script>
{#if false}
{:else if route === 'accelerators'}
  <AcceleratorsScenario />
{:else}
  <div></div>
{/if}
`,
    );
  }

  return root;
}

describe('runContributeComponent', () => {
  it('creates react stubs, styles, index export, and changelog', async () => {
    const root = await fakeMonorepo();
    const result = await runContributeComponent(root, 'react', 'StatusPill');

    expect(result.created).toContain('packages/react/src/StatusPill/StatusPill.tsx');
    expect(result.created).toContain('packages/react/src/StatusPill/StatusPill.test.tsx');
    expect(result.created).toContain(
      'packages/styles/src/components/StatusPill/StatusPill.module.css',
    );
    expect(result.report).toContain('Contributor checklist:');
    expect(result.report).toContain('Core → Styles → Adapters');

    const component = await readFile(
      join(root, 'packages/react/src/StatusPill/StatusPill.tsx'),
      'utf-8',
    );
    expect(component).toContain('TODO: implement StatusPill');

    const index = await readFile(join(root, 'packages/react/src/index.ts'), 'utf-8');
    expect(index).toContain("export { StatusPill } from './StatusPill/StatusPill'");

    const changelog = await readFile(join(root, 'packages/react/CHANGELOG.md'), 'utf-8');
    expect(changelog).toContain('## Unreleased');
    expect(changelog).toContain('StatusPill');

    const stylesChangelog = await readFile(join(root, 'packages/styles/CHANGELOG.md'), 'utf-8');
    expect(stylesChangelog).toContain('StatusPill');
  });

  it('scaffolds all UI adapters with styles once', async () => {
    const root = await fakeMonorepo({ withVueSvelte: true });
    const result = await runContributeComponent(root, 'all', 'StatusPill');

    expect(result.plans).toHaveLength(3);
    expect(result.created).toContain('packages/react/src/StatusPill/StatusPill.tsx');
    expect(result.created).toContain('packages/vue/src/components/StatusPill/StatusPill.vue');
    expect(result.created).toContain(
      'packages/svelte/src/lib/components/StatusPill/StatusPill.svelte',
    );
    expect(
      result.created.filter((p) => p.includes('StatusPill.module.css')),
    ).toHaveLength(1);
    expect(result.report).toContain('guided parity');
  });

  it('creates story stub and sandbox hook when requested', async () => {
    const root = await fakeMonorepo({ withSandbox: true });
    const result = await runContributeComponent(root, 'react', 'StatusPill', {
      withStory: true,
      sandboxHook: 'forms',
    });

    expect(result.created).toContain('apps/playground/stories/StatusPill.stories.tsx');
    const forms = await readFile(
      join(root, 'apps/sandbox-react/src/scenarios/Forms.tsx'),
      'utf-8',
    );
    expect(forms).toContain('TODO: mount StatusPill');
    expect(result.report).toContain('Story stub');
  });

  it('wires a new shared scenario flow', async () => {
    const root = await fakeMonorepo({ withSandbox: true });
    const result = await runContributeComponent(root, 'react', 'StatusPill', {
      scenario: 'focus-trap',
    });

    expect(result.created).toContain('apps/sandbox-react/src/scenarios/FocusTrap.tsx');
    const catalog = await readFile(join(root, 'apps/sandbox-shared/scenarios.js'), 'utf-8');
    expect(catalog).toContain("id: 'focus-trap'");
    const app = await readFile(join(root, 'apps/sandbox-react/src/App.tsx'), 'utf-8');
    expect(app).toContain('FocusTrapScenario');
    expect(app).toContain("case 'focus-trap':");
  });

  it('refuses to overwrite existing files', async () => {
    const root = await fakeMonorepo();
    await runContributeComponent(root, 'react', 'StatusPill');
    await expect(runContributeComponent(root, 'react', 'StatusPill')).rejects.toThrow(
      /overwrite/i,
    );
  });

  it('dry-run does not write files', async () => {
    const root = await fakeMonorepo();
    const result = await runContributeComponent(root, 'react', 'Ghost', { dryRun: true });
    expect(result.report).toContain('[dry-run]');
    expect(result.report).toContain('Contributor checklist:');
    await expect(
      readFile(join(root, 'packages/react/src/Ghost/Ghost.tsx'), 'utf-8'),
    ).rejects.toThrow();
  });
});

describe('assertPackageStructure', () => {
  it('fails when package is missing', async () => {
    const root = await mkdtemp(join(tmpdir(), 'larose-missing-'));
    const plan = planComponentScaffold('react', 'X');
    await expect(assertPackageStructure(root, 'react', plan)).rejects.toThrow(/not found/i);
  });
});
