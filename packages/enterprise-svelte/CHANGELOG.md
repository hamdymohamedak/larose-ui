# @larose-ui/enterprise-svelte

## 0.3.2

### Patch Changes

- 63e3d3b: Improve npm package READMEs and point Homepage to the docs site.

  - Remove the confusing "Recommended app stack" install list from package READMEs
  - Set `homepage` to https://hamdymohamedak.github.io/larose-ui/ for all packages
  - Align docs (architecture / Vue / Svelte / Next / design guides) with the one-CSS install story

- Updated dependencies [63e3d3b]
  - @larose-ui/core@0.3.2
  - @larose-ui/enterprise-core@0.3.2
  - @larose-ui/forms-svelte@0.3.2
  - @larose-ui/observability-svelte@0.3.2
  - @larose-ui/permissions-svelte@0.3.2
  - @larose-ui/runtime-svelte@1.0.2
  - @larose-ui/svelte@0.3.2

## 0.3.1

### Patch Changes

- 14c415f: Clarify the public npm surface and ship the one-CSS install story.

  - Mark building-block packages as internal (still published for transitive installs; not product docs).
  - Bundle design tokens into `@larose-ui/styles/styles.css` and `@larose-ui/react/styles.css` so apps need a single CSS import.
  - Align package metadata, readmes, and docs install copy with the public vs internal split.

- Updated dependencies [14c415f]
  - @larose-ui/core@0.3.1
  - @larose-ui/enterprise-core@0.3.1
  - @larose-ui/forms-svelte@0.3.1
  - @larose-ui/observability-svelte@0.3.1
  - @larose-ui/permissions-svelte@0.3.1
  - @larose-ui/runtime-svelte@1.0.1
  - @larose-ui/svelte@0.3.1

## 0.3.0

### Minor Changes

- b11853a: Cross-framework LiquidGlass parity, runtime providers, sandboxes, and platform adapter cleanup.

### Patch Changes

- Updated dependencies [b11853a]
  - @larose-ui/core@0.3.0
  - @larose-ui/enterprise-core@0.3.0
  - @larose-ui/forms-svelte@0.3.0
  - @larose-ui/observability-svelte@0.3.0
  - @larose-ui/permissions-svelte@0.3.0
  - @larose-ui/runtime-svelte@1.0.0
  - @larose-ui/svelte@0.3.0
