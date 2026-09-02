---
name: larose-ui-packages
description: Explore laRose UI monorepo packages, integration paths, and package-specific docs. Use when choosing @larose-ui packages or comparing React, Vue, and Svelte adapters.
license: MIT
metadata:
  author: hamdymohamedak
  version: "0.1.1"
---

# laRose UI Packages

Use this skill when selecting or integrating packages from the laRose UI monorepo.

## Package index

- Human-readable index: `/docs/packages`
- Package docs: `/docs/packages/{id}`
- Concise machine index: `/llms.txt` (Packages section)

## Common packages

| Package | When to use |
| --- | --- |
| `@larose-ui/react` | React components |
| `@larose-ui/vue` | Vue 3 components |
| `@larose-ui/svelte` | Svelte 5 components |
| `@larose-ui/tokens` | Design tokens as CSS variables |
| `@larose-ui/themes` | Theme presets and branding |
| `@larose-ui/runtime` | Theme, i18n, permissions, network |
| `@larose-ui/forms` | Schema-driven forms |
| `@larose-ui/migration` | Codemods and upgrade tooling |

## Workflow

1. Start at `/docs/packages` to see all published packages.
2. Open `/docs/packages/{id}` for features, peer deps, and examples.
3. Follow framework guides when wiring providers (`/docs/guides/*`).
