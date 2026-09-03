# laRose Architecture

laRose is a **UI Operating System** for modern SaaS applications — not a component library.

## Layer Model

```text
                    laRose UI OS
                         │
              Shared cores (*-core, primitives, …)
                         │
        ┌────────────────┼────────────────┐
        │                │                │
   React adapters   Vue adapters     Svelte adapters
   react / runtime  vue (+ runtime)  svelte (+ runtime)
   forms / data /   *-vue packages   *-svelte packages
   ai / enterprise  …
        │                │                │
        └────────────────┼────────────────┘
                         │
              Observability + Quality (cores + adapters)
```

## Shared styles

Component CSS lives in `@larose-ui/styles` (framework-agnostic). Import tokens first, then shared component styles:

```ts
import '@larose-ui/tokens/styles.css';
import '@larose-ui/styles/styles.css';
```

`@larose-ui/react/styles.css` remains available for backward compatibility.

## Runtime core

Framework-independent runtime logic lives in `@larose-ui/runtime-core` (store, bridges, tenant, i18n, host detection). `@larose-ui/runtime` is the React adapter (`LaRoseProvider`, hooks) and mounts `AcceleratorProvider` from `@larose-ui/react`.

The lightweight `LaRoseProvider` in `@larose-ui/react` remains for theme/motion-only setups without the full runtime stack.

## Component contracts

Canonical component APIs live in `contracts/components/*.json` as **framework-neutral** contracts (`framework: "neutral"`). Types are normalized away from React (`ReactNode` → `Node`, `CSSProperties` → `Style`, etc.). Constant exports (`MAX_*`, `STANDARD_*`, SCREAMING_SNAKE) are excluded — contracts cover real components only.

Validated by `@larose-ui/contracts` and `larose doctor`. Regenerate from the React index (authoring source) with:

```bash
pnpm generate:contracts
```

Vue and Svelte adapters should conform to the same JSON; Doctor compares live extraction against these files.

## Cross-framework Storybook registry

Playground parity mounts live in `apps/playground/.storybook/crossFramework/`. Prefer:

- `defineSlotParity` — text-slot components (Button, Badge, Typography, …)
- `definePropsParity` — prop-only controls (Input, Switch, Spinner, …), with optional `withNoopHandlers` / `wrapReact`

Domain modules under `registry/`:

- `defaults.ts` — shared fixtures
- `foundation.tsx` — compact `defineSlotParity` / `definePropsParity` definitions
- `liquidGlass.tsx` — Liquid Glass surfaces / chrome (`defineCustomParity`)
- `menus.tsx` — Menu, ContextMenu, Dock, CommandPalette, …
- `document.tsx` — DocumentToolbar, FileBrowser, DocumentWorkspace, …
- `demos.tsx` — remaining composite scenes (overlays, lists, sharing demos)
- `registry.tsx` — merges all domain registries

Generate a tooling manifest with:

```bash
pnpm generate:cross-framework-manifest
```

## Headless primitives

Interactive behavior lives in `@larose-ui/primitives` (menu type-ahead, keyboard, focus trap, tabs, disclosure, selection, drag-drop sessions). Framework packages are thin rendering adapters.

## Liquid Glass engine

Optics, displacement maps, refraction detection, and shared Liquid Glass types live in `@larose-ui/liquid-glass-core`. React, Vue, and Svelte adapters import that package — they must not reimplement the engine.

## Shared component logic

HIG helpers, validators, and domain transforms (`utils.ts`) live in `@larose-ui/component-logic`. Framework packages re-export thin shims — do not copy-paste utils across React/Vue/Svelte.

## Intelligence core adapters

Framework-independent quality and telemetry logic lives in `-core` packages. Framework packages are thin adapters:

| Core | Adapters |
|------|----------|
| `@larose-ui/observability-core` | `observability` / `observability-vue` / `observability-svelte` |
| `@larose-ui/devtools-core` | `devtools` (React inspector; fiber is React-specific) |
| `@larose-ui/quality-core` | `@larose-ui/cli` (doctor runner) |
| `@larose-ui/permissions-core` | `permissions` / `permissions-vue` / `permissions-svelte` |
| `@larose-ui/forms-core` | `forms` / `forms-vue` / `forms-svelte` |
| `@larose-ui/data-core` | `data` / `data-vue` / `data-svelte` |
| `@larose-ui/runtime-core` | `runtime` (React); `runtime-vue`; `runtime-svelte` |
| `@larose-ui/ai-core` | `ai` / `ai-vue` / `ai-svelte` |
| `@larose-ui/enterprise-core` | `enterprise` / `enterprise-vue` / `enterprise-svelte` |
| `@larose-ui/testing-core` | `testing` / `testing-vue` / `testing-svelte` |
| `@larose-ui/devtools-core` | `devtools` / `devtools-vue` / `devtools-svelte` |
| `@larose-ui/liquid-glass-core` | `react` / `vue` / `svelte` LiquidGlass adapters |

Doctor reads `larose.config.json` for framework-specific component and story paths. Add Vue/Svelte targets there when those bindings exist.

## Meta-framework adapters

| Package | Role |
|---------|------|
| `@larose-ui/next` | Next.js / SSR helpers — CSS paths, theme bootstrap script, `LaRoseRoot` client boundary |
| `@larose-ui/vue` | Vue 3 components + theme `LaRoseProvider` |
| `@larose-ui/nuxt` | Nuxt module — CSS, theme script, `LaRoseApp`, auto-imports |
| `@larose-ui/svelte` | Svelte 5 components + theme `LaRoseProvider` |
| `@larose-ui/sveltekit` | SvelteKit helpers — CSS paths + theme bootstrap script |
| `@larose-ui/runtime-vue` / `runtime-svelte` | Framework runtime adapters over `runtime-core` |
| TanStack Start | Same React packages; see [TANSTACK_START.md](../ecosystem/TANSTACK_START.md) |

See [VUE.md](../ecosystem/VUE.md), [NEXTJS.md](../ecosystem/NEXTJS.md), and [SVELTE.md](../ecosystem/SVELTE.md). Framework packages do not duplicate components — they consume shared styles, tokens, primitives, and runtime-core.

## Package Rules

1. `@larose-ui/core` has zero dependencies — types, state machines, runtime contracts
2. No circular dependencies between packages
3. Intelligence packages compose at the app layer — not each other
4. Runtime orchestrates; domain packages implement
5. DevTools and CLI are leaf packages
6. `-core` packages must not depend on React, Vue, or Svelte
7. Shared logic (utils, engines, state machines) must not be duplicated across framework packages — extract to a shared package first

## Runtime ↔ DevTools ↔ Doctor Triad

Every metric captured in **Runtime** must be inspectable in **DevTools**.
Every detectable issue must be auditable by **Doctor** in CI.

## Dependency Graph

See [RUNTIME_2.md](../runtime/RUNTIME_2.md) for Runtime 2.0 design.

## Versioning and product direction

- Versioning policy: [VERSIONING.md](./VERSIONING.md)
- Multi-framework product positioning: [PRODUCT_POSITIONING.md](./PRODUCT_POSITIONING.md)

## Examples

### Basic

```tsx
import { LaRoseProvider } from '@larose-ui/runtime';
import { Button } from '@larose-ui/react';

<LaRoseProvider locale="en" permissions={['app.read']}>
  <Button>Save</Button>
</LaRoseProvider>
```

### Enterprise

```tsx
<LaRoseProvider
  tenant={{ id: 'acme', timezone: 'Africa/Cairo' }}
  user={{ id: 'ahmed', roles: ['hr-manager'] }}
  session="authenticated"
  featureFlagEvaluator={rolloutEvaluator}
  version={{ frontend: '3.2.0', api: 'v4' }}
>
  <App />
</LaRoseProvider>
```

### Production

```tsx
<LaRoseProvider
  environment="production"
  observabilityAdapter={sentryAdapter}
  onRuntimeEvent={(e) => pipeline.ingest(e)}
  session="authenticated"
>
  <SessionGuard loginUrl="/login">
    <App />
  </SessionGuard>
</LaRoseProvider>
```
