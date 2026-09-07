#!/usr/bin/env node
/**
 * Generate README.md files and npm metadata for all publishable packages,
 * using the public-surface taxonomy (public products vs internal building blocks).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  getPackageSurface,
  LAYER_LABELS,
  listPackageDirs,
  PUBLIC_PACKAGES,
  recommendedStartPackages,
} from './public-surface.mjs';

const REPO = 'https://github.com/hamdymohamedak/larose-ui';
const REPO_GIT = 'git+https://github.com/hamdymohamedak/larose-ui.git';
const DOCS = 'https://hamdymohamedak.github.io/larose-ui/';

function frameworkFromPackage(name) {
  if (name === 'react' || name.endsWith('-react') || name === 'next') return 'react';
  if (name === 'vue' || name.endsWith('-vue') || name === 'nuxt') return 'vue';
  if (name === 'svelte' || name.endsWith('-svelte') || name === 'sveltekit') return 'svelte';
  return 'react';
}

function renderInstallBlock(packages) {
  const line = packages.join(' ');
  return `\`\`\`bash
npm install ${line}
# or
pnpm add ${line}
# or
yarn add ${line}
\`\`\``;
}

function renderPublicReadme(name, surface) {
  const pkg = `@larose-ui/${name}`;
  const framework = frameworkFromPackage(name);
  const start = recommendedStartPackages(framework);
  const example = surface.example ?? `import {} from '${pkg}';`;
  const isUiOrRuntime =
    surface.layer === 'ui' || surface.layer === 'runtime' || surface.layer === 'styles';
  const installPkgs =
    isUiOrRuntime && (name === framework || name === `runtime-${framework}` || name === 'styles')
      ? start.install
      : [pkg];

  return `# ${pkg}

> ${surface.tagline}

**Docs:** [${DOCS.replace(/\/$/, '')}](${DOCS}) · **Source:** [laRose UI](${REPO})

**Public API layer:** ${LAYER_LABELS[surface.layer] ?? surface.layer}

## Install

${renderInstallBlock(installPkgs)}
${surface.peer ? `\n**Peer dependency:** \`${surface.peer}\`\n` : ''}
## Quick start

\`\`\`tsx
${example}
\`\`\`

${
  isUiOrRuntime
    ? `Styles: \`${start.stylesImport}\` (design tokens are bundled — no separate \`@larose-ui/tokens\` CSS import).\n`
    : ''
}
## Features

${(surface.features ?? [surface.tagline]).map((f) => `- ${f}`).join('\n')}

## Documentation

- [laRose UI Docs](${DOCS}) — getting started, components, guides
- [Public API surface](${REPO}/blob/main/docs/PUBLIC_API.md)
- [Report an issue](${REPO}/issues)

## License

MIT © [laRose UI](${REPO})
`;
}

function renderInternalReadme(name, surface) {
  const pkg = `@larose-ui/${name}`;
  const start = recommendedStartPackages('react');

  return `# ${pkg}

> **Internal package** — ${surface.tagline}

Published only so other \`@larose-ui/*\` packages can depend on it.
**Do not install this in app code** — start from the public UI + runtime packages instead.

## Use this instead

\`\`\`bash
pnpm add ${start.install.join(' ')}
\`\`\`

Then import styles once: \`${start.stylesImport}\`.

Full guides: [laRose UI Docs](${DOCS}) · [Public API surface](${REPO}/blob/main/docs/PUBLIC_API.md)

## When this package is appropriate

- You are extending laRose itself (adapters, CLI, custom bindings)
- You need a low-level primitive that is not re-exported yet

Golden rule: if another laRose package already depends on this for you, install the public package — not this one.

## License

MIT © [laRose UI](${REPO})
`;
}

const packagesDir = join(process.cwd(), 'packages');

for (const name of listPackageDirs(packagesDir)) {
  const surface = getPackageSurface(name);
  const dir = join(packagesDir, name);
  const pkgPath = join(dir, 'package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));

  const readme = surface.publicApi
    ? renderPublicReadme(name, surface)
    : renderInternalReadme(name, surface);
  writeFileSync(join(dir, 'README.md'), readme);

  pkg.license = 'MIT';
  pkg.publishConfig = { access: 'public' };
  pkg.repository = {
    type: 'git',
    url: REPO_GIT,
    directory: `packages/${name}`,
  };
  pkg.homepage = DOCS;
  pkg.bugs = { url: `${REPO}/issues` };
  pkg.larose = {
    ...(pkg.larose && typeof pkg.larose === 'object' ? pkg.larose : {}),
    publicApi: surface.publicApi,
    layer: surface.layer,
  };

  if (surface.publicApi) {
    pkg.description = surface.tagline;
    const keywords = new Set(pkg.keywords ?? ['larose', 'larose-ui', 'ui-platform', 'design-system', 'saas']);
    keywords.add('larose-public');
    keywords.delete('larose-internal');
    pkg.keywords = [...keywords];
  } else {
    pkg.description = `[Internal] ${surface.tagline} Prefer @larose-ui/react, @larose-ui/vue, @larose-ui/svelte, or @larose-ui/runtime-* in apps.`;
    const keywords = new Set(pkg.keywords ?? ['larose', 'larose-ui']);
    keywords.add('larose-internal');
    keywords.delete('larose-public');
    pkg.keywords = [...keywords];
  }

  const files = new Set(pkg.files ?? ['dist']);
  files.add('README.md');
  pkg.files = [...files];

  writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
  const badge = surface.publicApi ? 'public' : 'internal';
  console.log(`✓ packages/${name} — README.md + metadata (${badge}/${surface.layer})`);
}

const publicCount = Object.keys(PUBLIC_PACKAGES).length;
const total = listPackageDirs(packagesDir).length;
console.log(`\nDone. Public surface: ${publicCount} / ${total} publishable packages.`);
console.log('Homepage for all packages →', DOCS);
console.log('Run pnpm changeset and publish to update npm package pages.');
