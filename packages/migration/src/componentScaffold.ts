/**
 * Smart contribution scaffolds for laRose packages.
 * Plans stubs only — implementation stays with the contributor.
 */

export type ScaffoldKind = 'ui-component' | 'module';

export type FrameworkId =
  | 'react'
  | 'vue'
  | 'svelte'
  | 'styles'
  | 'tauri'
  | 'electron'
  | 'generic';

export interface PackageScripts {
  build: string;
  test: string;
  typecheck: string;
  dev?: string;
}

export interface PackageProfile {
  /** Directory name under packages/ */
  id: string;
  npmName: string;
  kind: ScaffoldKind;
  framework: FrameworkId;
  /** Relative to package root — where new units live */
  sourceRoot: string;
  /** Relative to package root — barrel export file */
  indexPath: string;
  /** How the unit is exported from the barrel */
  exportStyle: 'named' | 'default-as';
  /** Whether shared CSS modules under @larose-ui/styles are created */
  usesSharedStyles: boolean;
  /** Short description for `larose contribute list` */
  summary: string;
  scripts: PackageScripts;
  /** Extra contributor guidance after scaffold */
  tips: string[];
}

export interface ScaffoldFile {
  /** Relative to monorepo root */
  path: string;
  contents: string;
  role: 'component' | 'test' | 'styles' | 'module' | 'other';
}

export interface ScaffoldPlan {
  packageId: string;
  npmName: string;
  name: string;
  kind: ScaffoldKind;
  files: ScaffoldFile[];
  /** Relative paths of barrel files to append exports to */
  indexUpdates: Array<{ path: string; exportLines: string[] }>;
  /** Packages whose CHANGELOG.md should get an Unreleased entry */
  changelogPackages: string[];
  changelogMessage: string;
  nextSteps: string[];
  displayPaths: {
    component?: string;
    test?: string;
    styles?: string;
  };
}

const UI_TIPS_SHARED = [
  'Implement the stub — do not leave TODO UI in a PR.',
  'Shared CSS lives in @larose-ui/styles (framework-agnostic).',
  'After real props exist: pnpm generate:contracts',
  'Add a Storybook story under apps/playground/stories/ and update quality/visual-baseline.json',
  'Run pnpm changeset (minor) before opening a PR to dev',
];

/** Known package contribution profiles. Unknown packages fall back to generic module. */
export const PACKAGE_PROFILES: Record<string, PackageProfile> = {
  react: {
    id: 'react',
    npmName: '@larose-ui/react',
    kind: 'ui-component',
    framework: 'react',
    sourceRoot: 'src',
    indexPath: 'src/index.ts',
    exportStyle: 'named',
    usesSharedStyles: true,
    summary: 'React UI components (primary adapter)',
    scripts: {
      build: 'pnpm --filter @larose-ui/react build',
      test: 'pnpm --filter @larose-ui/react test',
      typecheck: 'pnpm --filter @larose-ui/react typecheck',
      dev: 'pnpm --filter @larose-ui/react dev',
    },
    tips: [
      ...UI_TIPS_SHARED,
      'Rebuild styles if CSS changed: pnpm --filter @larose-ui/styles build',
      'Preview in Storybook: pnpm dev',
    ],
  },
  vue: {
    id: 'vue',
    npmName: '@larose-ui/vue',
    kind: 'ui-component',
    framework: 'vue',
    sourceRoot: 'src/components',
    indexPath: 'src/index.ts',
    exportStyle: 'default-as',
    usesSharedStyles: true,
    summary: 'Vue 3 UI components (thin adapter over shared styles)',
    scripts: {
      build: 'pnpm --filter @larose-ui/vue build',
      test: 'pnpm --filter @larose-ui/vue test',
      typecheck: 'pnpm --filter @larose-ui/vue typecheck',
      dev: 'pnpm --filter @larose-ui/vue dev',
    },
    tips: [
      ...UI_TIPS_SHARED,
      'Match the React contract when porting a parity component.',
      'Add the name to PARITY_COMPONENTS in apps/docs/src/lib/frameworks.ts when Vue+Svelte+React all exist.',
    ],
  },
  svelte: {
    id: 'svelte',
    npmName: '@larose-ui/svelte',
    kind: 'ui-component',
    framework: 'svelte',
    sourceRoot: 'src/lib/components',
    indexPath: 'src/lib/index.ts',
    exportStyle: 'default-as',
    usesSharedStyles: true,
    summary: 'Svelte 5 UI components (runes + shared styles)',
    scripts: {
      build: 'pnpm --filter @larose-ui/svelte build',
      test: 'pnpm --filter @larose-ui/svelte test',
      typecheck: 'pnpm --filter @larose-ui/svelte typecheck',
      dev: 'pnpm --filter @larose-ui/svelte dev',
    },
    tips: [
      ...UI_TIPS_SHARED,
      'Use Svelte 5 runes ($props / $state). Avoid legacy stores for new components.',
    ],
  },
  styles: {
    id: 'styles',
    npmName: '@larose-ui/styles',
    kind: 'ui-component',
    framework: 'styles',
    sourceRoot: 'src/components',
    indexPath: 'src/index.ts',
    exportStyle: 'named',
    usesSharedStyles: true,
    summary: 'Shared CSS modules only (no framework adapter)',
    scripts: {
      build: 'pnpm --filter @larose-ui/styles build',
      test: 'pnpm --filter @larose-ui/styles test',
      typecheck: 'pnpm --filter @larose-ui/styles typecheck',
    },
    tips: [
      'CSS modules are auto-bundled by scripts/build-styles-package.mjs — no barrel import needed.',
      'Use --lr-* tokens from @larose-ui/tokens.',
    ],
  },
  tauri: {
    id: 'tauri',
    npmName: '@larose-ui/tauri',
    kind: 'module',
    framework: 'tauri',
    sourceRoot: 'src',
    indexPath: 'src/index.ts',
    exportStyle: 'named',
    usesSharedStyles: false,
    summary: 'Tauri host adapter (menus, bootstrap, chrome) — not a UI component package',
    scripts: {
      build: 'pnpm --filter @larose-ui/tauri build',
      test: 'pnpm --filter @larose-ui/tauri test',
      typecheck: 'pnpm --filter @larose-ui/tauri typecheck',
      dev: 'pnpm --filter @larose-ui/tauri dev',
    },
    tips: [
      'Prefer desktop-core for shared host logic; keep Tauri-specific glue here.',
      'Peer: @tauri-apps/api >= 2',
    ],
  },
  electron: {
    id: 'electron',
    npmName: '@larose-ui/electron',
    kind: 'module',
    framework: 'electron',
    sourceRoot: 'src',
    indexPath: 'src/index.ts',
    exportStyle: 'named',
    usesSharedStyles: false,
    summary: 'Electron host adapter — not a UI component package',
    scripts: {
      build: 'pnpm --filter @larose-ui/electron build',
      test: 'pnpm --filter @larose-ui/electron test',
      typecheck: 'pnpm --filter @larose-ui/electron typecheck',
      dev: 'pnpm --filter @larose-ui/electron dev',
    },
    tips: [
      'Prefer desktop-core for shared host logic; keep Electron-specific glue here.',
    ],
  },
};

export function toPascalCase(input: string): string {
  const cleaned = input.trim().replace(/[^a-zA-Z0-9]+/g, ' ');
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  return parts
    .map((part) => {
      if (/^[A-Z][a-zA-Z0-9]*$/.test(part) && /[a-z]/.test(part)) return part;
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    })
    .join('');
}

export function toCamelCase(name: string): string {
  const pascal = toPascalCase(name);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

export function listPackageProfiles(): PackageProfile[] {
  return Object.values(PACKAGE_PROFILES).sort((a, b) => a.id.localeCompare(b.id));
}

export function resolvePackageProfile(
  packageId: string,
  packageJson?: { name?: string; scripts?: Record<string, string> },
): PackageProfile {
  const known = PACKAGE_PROFILES[packageId];
  if (known) return known;

  const npmName = packageJson?.name ?? `@larose-ui/${packageId}`;
  const scripts = packageJson?.scripts ?? {};
  return {
    id: packageId,
    npmName,
    kind: 'module',
    framework: 'generic',
    sourceRoot: 'src',
    indexPath: 'src/index.ts',
    exportStyle: 'named',
    usesSharedStyles: false,
    summary: `Generic module scaffold for ${npmName}`,
    scripts: {
      build: scripts.build
        ? `pnpm --filter ${npmName} build`
        : `pnpm --filter ${npmName} build`,
      test: `pnpm --filter ${npmName} test`,
      typecheck: `pnpm --filter ${npmName} typecheck`,
      dev: scripts.dev ? `pnpm --filter ${npmName} dev` : undefined,
    },
    tips: [
      'This package has no dedicated UI profile — scaffolding a TypeScript module under src/.',
      'Inspect an existing file in this package and match its patterns.',
    ],
  };
}

function reactStub(name: string): string {
  return `import type { ReactNode } from 'react';
import styles from '@larose-ui/styles/components/${name}/${name}.module.css';

export interface ${name}Props {
  className?: string;
  children?: ReactNode;
}

/** TODO: implement ${name} for @larose-ui/react */
export function ${name}({ className, children }: ${name}Props) {
  return (
    <div className={[styles.root, className].filter(Boolean).join(' ')} data-larose="${name}">
      {children}
    </div>
  );
}
`;
}

function reactTestStub(name: string): string {
  return `import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ${name} } from './${name}';

describe('${name}', () => {
  it('renders stub root', () => {
    render(<${name}>hello</${name}>);
    expect(screen.getByText('hello')).toBeTruthy();
  });
});
`;
}

function vueStub(name: string): string {
  return `<script setup lang="ts">
import styles from '@larose-ui/styles/components/${name}/${name}.module.css';

defineProps<{
  class?: string;
}>();
</script>

<template>
  <!-- TODO: implement ${name} for @larose-ui/vue -->
  <div :class="[styles.root, $props.class].filter(Boolean)" :data-larose="'${name}'">
    <slot />
  </div>
</template>
`;
}

function vueTestStub(name: string): string {
  return `import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import ${name} from './${name}.vue';

describe('${name}', () => {
  it('renders stub root', () => {
    const wrapper = mount(${name}, { slots: { default: 'hello' } });
    expect(wrapper.text()).toContain('hello');
  });
});
`;
}

function svelteStub(name: string): string {
  return `<script lang="ts">
  import type { Snippet } from 'svelte';
  import styles from '@larose-ui/styles/components/${name}/${name}.module.css';

  interface Props {
    class?: string;
    children?: Snippet;
  }

  let { class: className, children }: Props = $props();
</script>

<!-- TODO: implement ${name} for @larose-ui/svelte -->
<div class={[styles.root, className].filter(Boolean).join(' ')} data-larose="${name}">
  {#if children}
    {@render children()}
  {/if}
</div>
`;
}

function svelteTestStub(name: string): string {
  return `import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import ${name} from './${name}.svelte';

describe('${name}', () => {
  it('renders stub root', () => {
    render(${name}, { props: {} });
    expect(document.querySelector('[data-larose="${name}"]')).toBeTruthy();
    void screen;
  });
});
`;
}

function stylesStub(name: string): string {
  return `.root {
  /* TODO: style ${name} with --lr-* tokens from @larose-ui/tokens */
}
`;
}

function moduleStub(name: string, npmName: string): string {
  const camel = toCamelCase(name);
  return `/**
 * TODO: implement ${name} for ${npmName}
 */
export function ${camel}(): void {
  throw new Error('${name} is not implemented yet');
}
`;
}

function moduleTestStub(name: string): string {
  const camel = toCamelCase(name);
  return `import { describe, expect, it } from 'vitest';
import { ${camel} } from './${camel}';

describe('${name}', () => {
  it('is stubbed', () => {
    expect(() => ${camel}()).toThrow(/not implemented/i);
  });
});
`;
}

function exportLinesFor(profile: PackageProfile, name: string): string[] {
  if (profile.framework === 'styles') return [];

  if (profile.kind === 'module') {
    const camel = toCamelCase(name);
    const rel = `./${camel}/${camel}`;
    return [`export { ${camel} } from '${rel}';`];
  }

  if (profile.exportStyle === 'named') {
    return [
      `export { ${name} } from './${name}/${name}';`,
      `export type { ${name}Props } from './${name}/${name}';`,
    ];
  }

  // Vue / Svelte barrels live above components/
  const prefix = profile.framework === 'svelte' || profile.framework === 'vue'
    ? './components'
    : '.';
  const ext = profile.framework === 'vue' ? '.vue' : profile.framework === 'svelte' ? '.svelte' : '';
  return [
    `export { default as ${name} } from '${prefix}/${name}/${name}${ext}';`,
  ];
}

/**
 * Build a scaffold plan. Does not touch the filesystem.
 */
export function planComponentScaffold(
  packageId: string,
  rawName: string,
  options: {
    packageJson?: { name?: string; scripts?: Record<string, string> };
    skipStyles?: boolean;
  } = {},
): ScaffoldPlan {
  const name = toPascalCase(rawName);
  if (!name || !/^[A-Z][A-Za-z0-9]*$/.test(name)) {
    throw new Error(
      `Invalid component name "${rawName}". Use PascalCase (e.g. StatusPill).`,
    );
  }

  const profile = resolvePackageProfile(packageId, options.packageJson);
  const pkgRoot = `packages/${profile.id}`;
  const files: ScaffoldFile[] = [];
  const displayPaths: ScaffoldPlan['displayPaths'] = {};
  const withStyles = profile.usesSharedStyles && !options.skipStyles;

  if (profile.framework === 'styles') {
    const stylesPath = `${pkgRoot}/src/components/${name}/${name}.module.css`;
    files.push({ path: stylesPath, contents: stylesStub(name), role: 'styles' });
    displayPaths.styles = stylesPath;
  } else if (profile.kind === 'ui-component') {
    if (profile.framework === 'react') {
      const componentPath = `${pkgRoot}/src/${name}/${name}.tsx`;
      const testPath = `${pkgRoot}/src/${name}/${name}.test.tsx`;
      files.push({ path: componentPath, contents: reactStub(name), role: 'component' });
      files.push({ path: testPath, contents: reactTestStub(name), role: 'test' });
      displayPaths.component = componentPath;
      displayPaths.test = testPath;
    } else if (profile.framework === 'vue') {
      const componentPath = `${pkgRoot}/src/components/${name}/${name}.vue`;
      const testPath = `${pkgRoot}/src/components/${name}/${name}.test.ts`;
      files.push({ path: componentPath, contents: vueStub(name), role: 'component' });
      files.push({ path: testPath, contents: vueTestStub(name), role: 'test' });
      displayPaths.component = componentPath;
      displayPaths.test = testPath;
    } else if (profile.framework === 'svelte') {
      const componentPath = `${pkgRoot}/src/lib/components/${name}/${name}.svelte`;
      const testPath = `${pkgRoot}/src/lib/components/${name}/${name}.test.ts`;
      files.push({ path: componentPath, contents: svelteStub(name), role: 'component' });
      files.push({ path: testPath, contents: svelteTestStub(name), role: 'test' });
      displayPaths.component = componentPath;
      displayPaths.test = testPath;
    }

    if (withStyles) {
      const stylesPath = `packages/styles/src/components/${name}/${name}.module.css`;
      files.push({ path: stylesPath, contents: stylesStub(name), role: 'styles' });
      displayPaths.styles = stylesPath;
    }
  } else {
    const camel = toCamelCase(name);
    const componentPath = `${pkgRoot}/src/${camel}/${camel}.ts`;
    const testPath = `${pkgRoot}/src/${camel}/${camel}.test.ts`;
    files.push({
      path: componentPath,
      contents: moduleStub(name, profile.npmName),
      role: 'module',
    });
    files.push({ path: testPath, contents: moduleTestStub(name), role: 'test' });
    displayPaths.component = componentPath;
    displayPaths.test = testPath;
  }

  const indexUpdates =
    profile.framework === 'styles'
      ? []
      : [
          {
            path: `${pkgRoot}/${profile.indexPath}`,
            exportLines: exportLinesFor(profile, name),
          },
        ];

  const changelogPackages = [profile.id];
  if (withStyles && profile.id !== 'styles') {
    changelogPackages.push('styles');
  }

  const unitLabel = profile.kind === 'ui-component' ? 'component' : 'module';
  const changelogMessage = `Scaffolded ${name} ${unitLabel} stub for contributor implementation.`;

  const nextSteps = [
    ...Object.entries(displayPaths)
      .filter(([, p]) => Boolean(p))
      .map(([role, path]) => `Edit ${role}: ${path}`),
    `Build: ${profile.scripts.build}`,
    `Test: ${profile.scripts.test}`,
    `Typecheck: ${profile.scripts.typecheck}`,
    ...(profile.scripts.dev ? [`Dev: ${profile.scripts.dev}`] : []),
    ...profile.tips,
  ];

  return {
    packageId: profile.id,
    npmName: profile.npmName,
    name,
    kind: profile.kind,
    files,
    indexUpdates,
    changelogPackages,
    changelogMessage,
    nextSteps,
    displayPaths,
  };
}

export function formatPackageList(profiles: PackageProfile[] = listPackageProfiles()): string {
  const lines = [
    'laRose contribution targets',
    '',
    'UI component packages (creates adapter + shared CSS + test):',
  ];
  for (const p of profiles.filter((x) => x.kind === 'ui-component')) {
    lines.push(`  ${p.id.padEnd(12)} ${p.summary}`);
  }
  lines.push('', 'Module / host packages (creates TS module + test, no CSS):');
  for (const p of profiles.filter((x) => x.kind === 'module')) {
    lines.push(`  ${p.id.padEnd(12)} ${p.summary}`);
  }
  lines.push(
    '',
    'Any other packages/* id works as a generic module scaffold.',
    '',
    'Usage:',
    '  make contribute NAME=StatusPill PACKAGE=react',
    '  larose contribute component StatusPill --package vue',
    '  larose contribute list',
  );
  return lines.join('\n');
}

/**
 * Insert or append an ## Unreleased section entry in Changesets-style CHANGELOG.md.
 */
export function appendChangelogUnreleased(existing: string, message: string): string {
  const bullet = `- ${message}`;
  const unreleasedHeader = '## Unreleased';
  const minorHeader = '### Minor Changes';

  if (existing.includes(unreleasedHeader)) {
    const idx = existing.indexOf(unreleasedHeader);
    const afterHeader = existing.slice(idx + unreleasedHeader.length);
    if (afterHeader.includes(minorHeader)) {
      return existing.replace(
        `${unreleasedHeader}\n\n${minorHeader}`,
        `${unreleasedHeader}\n\n${minorHeader}\n\n${bullet}`,
      );
    }
    return existing.replace(
      unreleasedHeader,
      `${unreleasedHeader}\n\n${minorHeader}\n\n${bullet}`,
    );
  }

  // Insert after title line `# @larose-ui/...`
  const lines = existing.split('\n');
  const titleIdx = lines.findIndex((l) => l.startsWith('# '));
  const insertAt = titleIdx >= 0 ? titleIdx + 1 : 0;
  const block = ['', unreleasedHeader, '', minorHeader, '', bullet, ''];
  lines.splice(insertAt, 0, ...block);
  return lines.join('\n');
}

export function formatContributeReport(plan: ScaffoldPlan, created: string[]): string {
  const lines = [
    `✓ Scaffolded ${plan.name} in ${plan.npmName} (${plan.kind})`,
    '',
    'Created files:',
    ...created.map((p) => `  - ${p}`),
    '',
  ];

  if (plan.displayPaths.component) {
    lines.push(`Component: ${plan.displayPaths.component}`);
  }
  if (plan.displayPaths.test) {
    lines.push(`Test:      ${plan.displayPaths.test}`);
  }
  if (plan.displayPaths.styles) {
    lines.push(`Styles:    ${plan.displayPaths.styles}`);
  }

  lines.push('', 'Next steps for contributors:', ...plan.nextSteps.map((s) => `  • ${s}`));
  return lines.join('\n');
}
