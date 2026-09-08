# @larose-ui/react

## 0.3.2

### Patch Changes

- 63e3d3b: Improve npm package READMEs and point Homepage to the docs site.

  - Remove the confusing "Recommended app stack" install list from package READMEs
  - Set `homepage` to https://hamdymohamedak.github.io/larose-ui/ for all packages
  - Align docs (architecture / Vue / Svelte / Next / design guides) with the one-CSS install story

- Updated dependencies [63e3d3b]
  - @larose-ui/component-logic@0.3.2
  - @larose-ui/core@0.3.2
  - @larose-ui/liquid-glass-core@0.3.2
  - @larose-ui/primitives@0.3.2
  - @larose-ui/styles@0.3.2
  - @larose-ui/themes@0.3.2
  - @larose-ui/tokens@0.3.2

## 0.3.1

### Patch Changes

- 14c415f: Clarify the public npm surface and ship the one-CSS install story.

  - Mark building-block packages as internal (still published for transitive installs; not product docs).
  - Bundle design tokens into `@larose-ui/styles/styles.css` and `@larose-ui/react/styles.css` so apps need a single CSS import.
  - Align package metadata, readmes, and docs install copy with the public vs internal split.

- Updated dependencies [14c415f]
  - @larose-ui/component-logic@0.3.1
  - @larose-ui/core@0.3.1
  - @larose-ui/liquid-glass-core@0.3.1
  - @larose-ui/primitives@0.3.1
  - @larose-ui/styles@0.3.1
  - @larose-ui/themes@0.3.1
  - @larose-ui/tokens@0.3.1

## 0.3.0

### Minor Changes

- b11853a: Cross-framework LiquidGlass parity, runtime providers, sandboxes, and platform adapter cleanup.

### Patch Changes

- Updated dependencies [b11853a]
  - @larose-ui/component-logic@0.3.0
  - @larose-ui/core@0.3.0
  - @larose-ui/liquid-glass-core@0.3.0
  - @larose-ui/primitives@0.3.0
  - @larose-ui/styles@0.3.0
  - @larose-ui/themes@0.3.0
  - @larose-ui/tokens@0.3.0

## Unreleased

### Minor Changes

- Scaffolded Activity component stub for contributor implementation.


- Remove WebView components; laRose stays web-first without embedded browser chrome.

## 0.2.0

### Minor Changes

- e989652: Evolve laRose into a framework-agnostic UI operating system: extract shared styles to `@larose-ui/styles`, add Vue 3 and Svelte 5 parity adapters, Next/Nuxt/Electron/Tauri/desktop-core integrations, runtime-core and contracts packages, cross-framework Storybook parity toolbar, AlertDialog focus-ring fix, docs site redesign with beginner-friendly onboarding, and CI/build fixes.

### Patch Changes

- Updated dependencies [e989652]
  - @larose-ui/styles@0.2.0
  - @larose-ui/primitives@0.2.0
  - @larose-ui/core@0.2.0
  - @larose-ui/themes@0.1.2
  - @larose-ui/tokens@0.1.2

## 0.1.1

### Patch Changes

- f1f64e6: Add package README files and fix repository/homepage links to point at hamdymohamedak/larose-ui.
- Updated dependencies [f1f64e6]
  - @larose-ui/core@0.1.1
  - @larose-ui/tokens@0.1.1
