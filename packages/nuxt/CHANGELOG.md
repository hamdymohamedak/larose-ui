# @larose-ui/nuxt

## 0.3.2

### Patch Changes

- 14c415f: Clarify the public npm surface and ship the one-CSS install story.

  - Mark building-block packages as internal (still published for transitive installs; not product docs).
  - Bundle design tokens into `@larose-ui/styles/styles.css` and `@larose-ui/react/styles.css` so apps need a single CSS import.
  - Align package metadata, readmes, and docs install copy with the public vs internal split.

- Updated dependencies [14c415f]
- Updated dependencies [5400097]
  - @larose-ui/core@0.3.1
  - @larose-ui/runtime-vue@2.0.1
  - @larose-ui/vue@0.4.1

## 0.3.1

### Patch Changes

- Updated dependencies [5400097]
  - @larose-ui/vue@0.4.0
  - @larose-ui/runtime-vue@2.0.0

## 0.3.0

### Minor Changes

- b11853a: Cross-framework LiquidGlass parity, runtime providers, sandboxes, and platform adapter cleanup.

### Patch Changes

- Updated dependencies [b11853a]
  - @larose-ui/core@0.3.0
  - @larose-ui/runtime-vue@1.0.0
  - @larose-ui/vue@0.3.0

## 0.2.0

### Minor Changes

- e989652: Evolve laRose into a framework-agnostic UI operating system: extract shared styles to `@larose-ui/styles`, add Vue 3 and Svelte 5 parity adapters, Next/Nuxt/Electron/Tauri/desktop-core integrations, runtime-core and contracts packages, cross-framework Storybook parity toolbar, AlertDialog focus-ring fix, docs site redesign with beginner-friendly onboarding, and CI/build fixes.

### Patch Changes

- Updated dependencies [e989652]
  - @larose-ui/vue@0.2.0
  - @larose-ui/core@0.2.0
