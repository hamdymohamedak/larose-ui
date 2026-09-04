# Product Positioning

## Decision (current)

**Direction: Option B — true multi-framework platform.**

React, Vue 3, and Svelte 5 are **first-class adapters** over shared cores. React is not the foundation of platform intelligence.

```text
Shared Core (tokens, styles, primitives, component-logic, *-core)
      ↓
┌─────┼─────┐
React Vue Svelte
```

## What that means today

| Layer | Status |
|-------|--------|
| Visual UI (components + CSS) | React, Vue, and Svelte |
| Shared logic | `primitives`, `component-logic`, `liquid-glass-core`, `forms-core`, `data-core`, `permissions-core`, `observability-core`, `runtime-core`, `ai-core`, `enterprise-core`, `testing-core`, … |
| Intelligence UI | Equal adapters: `forms-react|vue|svelte`, `data-*`, `permissions-*`, `observability-*`, `ai-*`, `enterprise-*`, `testing-*` |
| Runtime UI | `runtime-core` + `runtime-react` / `runtime-vue` / `runtime-svelte` |
| DevTools | `devtools-core` + `devtools-react` / `devtools-vue` / `devtools-svelte` (Fiber = React-only) |
| Meta-frameworks | `@larose-ui/next` · `@larose-ui/nuxt` · `@larose-ui/sveltekit` |

## What we are not doing

- We are **not** choosing Option A (React-only platform with visual ports forever).
- We are **not** duplicating utils/engines into each framework package.
- We are **not** treating React as the implicit home for new platform logic.

See `docs/framework-neutrality-audit.md`. Enforce with `pnpm check:framework-neutrality`.
