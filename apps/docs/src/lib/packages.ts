import type { DocsPackageEntry } from '@/data/catalog.generated';
import { docsPackages } from '@/data/catalog.generated';
import type { DocsFramework } from '@/lib/frameworks';

export type PackageLayer = DocsPackageEntry['layer'];

/** App-facing packages only (public product story). */
export function publicDocsPackages(): DocsPackageEntry[] {
  return docsPackages.filter((pkg) => pkg.consumerFacing);
}

export const PACKAGE_LAYERS: { id: PackageLayer; label: string; blurb: string }[] = [
  {
    id: 'foundation',
    label: 'Foundation',
    blurb: 'One stylesheet (`@larose-ui/styles`) bundles design tokens + component CSS. Themes are optional branding.',
  },
  {
    id: 'ui',
    label: 'Framework UI',
    blurb: 'Pick one: React, Vue, or Svelte components.',
  },
  {
    id: 'runtime',
    label: 'Runtime',
    blurb: 'Full LaRoseProvider — theme, toast, network, offline, i18n.',
  },
  {
    id: 'intelligence',
    label: 'Intelligence',
    blurb: 'Opt-in: data, forms, permissions, observability, AI, enterprise.',
  },
  {
    id: 'meta',
    label: 'Meta-frameworks',
    blurb: 'Next.js, Nuxt, and SvelteKit bootstrap helpers.',
  },
  {
    id: 'tooling',
    label: 'Tooling',
    blurb: 'CLI, tests, DevTools, contracts, and migration helpers.',
  },
];

export interface InstallStack {
  id: string;
  title: string;
  framework: DocsFramework | 'any';
  description: string;
  command: string;
}

export const INSTALL_STACKS: InstallStack[] = [
  {
    id: 'react-ui',
    title: 'React — UI only',
    framework: 'react',
    description: 'Components + bundled styles (tokens included via react/styles.css).',
    command: 'pnpm add @larose-ui/react',
  },
  {
    id: 'react-runtime',
    title: 'React — full runtime',
    framework: 'react',
    description: 'UI plus LaRoseProvider (toast, network, offline, i18n).',
    command: 'pnpm add @larose-ui/react @larose-ui/runtime-react',
  },
  {
    id: 'next',
    title: 'Next.js',
    framework: 'react',
    description: 'SSR theme script + React UI + runtime.',
    command: 'pnpm add @larose-ui/next @larose-ui/react @larose-ui/runtime-react',
  },
  {
    id: 'vue-ui',
    title: 'Vue — UI only',
    framework: 'vue',
    description: 'Vue components + @larose-ui/styles (tokens bundled).',
    command: 'pnpm add @larose-ui/vue @larose-ui/styles',
  },
  {
    id: 'vue-runtime',
    title: 'Vue — full runtime',
    framework: 'vue',
    description: 'UI plus runtime-vue LaRoseProvider.',
    command: 'pnpm add @larose-ui/vue @larose-ui/runtime-vue @larose-ui/styles',
  },
  {
    id: 'nuxt',
    title: 'Nuxt',
    framework: 'vue',
    description: 'Nuxt module + Vue UI + runtime (module injects styles).',
    command: 'pnpm add @larose-ui/nuxt @larose-ui/vue @larose-ui/runtime-vue @larose-ui/styles',
  },
  {
    id: 'svelte-ui',
    title: 'Svelte — UI only',
    framework: 'svelte',
    description: 'Svelte 5 components + @larose-ui/styles (tokens bundled).',
    command: 'pnpm add @larose-ui/svelte @larose-ui/styles',
  },
  {
    id: 'svelte-runtime',
    title: 'Svelte — full runtime',
    framework: 'svelte',
    description: 'UI plus runtime-svelte LaRoseProvider.',
    command: 'pnpm add @larose-ui/svelte @larose-ui/runtime-svelte @larose-ui/styles',
  },
  {
    id: 'sveltekit',
    title: 'SvelteKit',
    framework: 'svelte',
    description: 'SvelteKit SSR helpers + Svelte UI + runtime.',
    command:
      'pnpm add @larose-ui/sveltekit @larose-ui/svelte @larose-ui/runtime-svelte @larose-ui/styles',
  },
];

export function packagesByLayer(layer: PackageLayer): DocsPackageEntry[] {
  return docsPackages.filter((pkg) => pkg.layer === layer).sort((a, b) => a.name.localeCompare(b.name));
}

export function resolveInstallCommand(
  pkg: DocsPackageEntry,
  framework?: DocsFramework,
  manager: 'pnpm' | 'npm' | 'yarn' = 'pnpm',
): string {
  const raw =
    (framework && pkg.install?.[framework]) ||
    pkg.install?.any ||
    `pnpm add ${pkg.name}`;
  if (manager === 'pnpm') return raw;
  if (manager === 'npm') {
    return raw.replace(/^pnpm add -D/, 'npm install -D').replace(/^pnpm add/, 'npm install');
  }
  return raw.replace(/^pnpm add -D/, 'yarn add -D').replace(/^pnpm add/, 'yarn add');
}

export function findRelatedPackages(pkg: DocsPackageEntry): DocsPackageEntry[] {
  return (pkg.related ?? [])
    .map((id) => docsPackages.find((entry) => entry.id === id))
    .filter((entry): entry is DocsPackageEntry => Boolean(entry));
}
