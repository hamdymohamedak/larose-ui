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
} from './public-surface.mjs';

const REPO = 'https://github.com/hamdymohamedak/larose-ui';
const REPO_GIT = 'git+https://github.com/hamdymohamedak/larose-ui.git';

function preferPublicImports(framework = 'react') {
  return [
    `@larose-ui/runtime-${framework}`,
    `@larose-ui/${framework}`,
    `@larose-ui/data-${framework}`,
    `@larose-ui/forms-${framework}`,
    `@larose-ui/permissions-${framework}`,
  ];
}

function renderPublicReadme(name, surface) {
  const pkg = `@larose-ui/${name}`;
  const docsSection = surface.docs ? `- [Package docs](${surface.docs})\n` : '';
  const example = surface.example ?? `import {} from '${pkg}';`;

  return `# ${pkg}

> ${surface.tagline}

Part of **[laRose UI](${REPO})** — start with UI + Runtime packages; feature packs are optional.

**Public API layer:** ${LAYER_LABELS[surface.layer] ?? surface.layer}

## Install

\`\`\`bash
npm install ${pkg}
# or
pnpm add ${pkg}
# or
yarn add ${pkg}
\`\`\`

${surface.peer ? `\n**Peer dependency:** \`${surface.peer}\`\n` : ''}

## Quick start

\`\`\`tsx
${example}
\`\`\`

## Features

${(surface.features ?? [surface.tagline]).map((f) => `- ${f}`).join('\n')}

## Recommended app stack

Install these first (example for React):

${preferPublicImports('react').map((p) => `- \`${p}\``).join('\n')}

Internal packages (\`core\`, \`tokens\`, \`*-core\`, …) are pulled in automatically — you usually do not need to depend on them directly.

## Documentation

- [Monorepo README](${REPO}#readme)
- [Public API surface](${REPO}/blob/main/docs/PUBLIC_API.md)
${docsSection}- [Report an issue](${REPO}/issues)

## License

MIT © [laRose UI](${REPO})
`;
}

function renderInternalReadme(name, surface) {
  const pkg = `@larose-ui/${name}`;
  const prefer = preferPublicImports('react');

  return `# ${pkg}

> **Internal package** — ${surface.tagline}

This package is published so other \`@larose-ui/*\` packages can depend on it.
**App developers should prefer the public surface** instead of importing this directly.

## Prefer these instead

${prefer.map((p) => `- \`${p}\``).join('\n')}

See [Public API surface](${REPO}/blob/main/docs/PUBLIC_API.md) for the full list.

## When to use this package

- You are extending laRose itself (adapters, CLI, custom bindings)
- You need a low-level primitive that is not re-exported yet

Golden rule: if your only reason to install this is “another laRose package already uses it”, install the public package instead.

## Install (advanced)

\`\`\`bash
pnpm add ${pkg}
\`\`\`

## Documentation

- [Monorepo README](${REPO}#readme)
- [Public API surface](${REPO}/blob/main/docs/PUBLIC_API.md)
- [Report an issue](${REPO}/issues)

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
  pkg.homepage = `${REPO}/blob/main/packages/${name}#readme`;
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
console.log('Run pnpm changeset and publish to update npm package pages.');
