---
name: larose-ui
description: >-
  Install, configure, and build UIs with laRose UI (@larose-ui/*) across React,
  Vue 3, and Svelte 5 — runtime provider, styles, components, feature packs,
  docs URLs, and Vite monorepo pitfalls. Use when the user mentions laRose,
  @larose-ui, LaRoseProvider, larose-ui docs, or wants agents (Cursor, Claude,
  Copilot) to implement UI with this design system.
---

# laRose UI — Agent Skill

**Docs:** https://hamdymohamedak.github.io/larose-ui/  
**Repo:** https://github.com/hamdymohamedak/larose-ui  
**Public API policy:** `docs/PUBLIC_API.md`

This skill teaches agents how to **consume** published npm packages (preferred). The monorepo clone is for library development only — do not `file:`-link it into apps unless explicitly asked.

## When to apply

- Installing or upgrading `@larose-ui/*`
- Wrapping an app with `LaRoseProvider`
- Replacing custom Button/Card/Input/Modal with laRose components
- Wiring permissions, data, forms, AI, or DevTools packs
- Debugging `Invalid hook call` / theme / styles issues
- Looking up docs paths or component metadata

## Golden rules

1. **Public surface only** — apps import UI + runtime + optional feature packs. Never import `*-core`, `tokens`, `primitives`, `component-logic` in app code (see [packages.md](packages.md)).
2. **Styles once** — React: `import '@larose-ui/react/styles.css'`. Vue/Svelte: `import '@larose-ui/styles/styles.css'`. Do **not** rely on JS auto-importing CSS.
3. **Provider from runtime** — `LaRoseProvider` from `@larose-ui/runtime-react` (not `@larose-ui/react`). Toasts: `@larose-ui/runtime-react/toast`.
4. **One React copy** — always `resolve.dedupe: ['react','react-dom']` in Vite monorepos (see [pitfalls.md](pitfalls.md)).
5. **npm latest** — use published versions; local `larose-ui/` clone is learning/contribution only.

## Quick start (React — default)

```bash
pnpm add @larose-ui/react @larose-ui/runtime-react
# or: npm i @larose-ui/react @larose-ui/runtime-react
```

```tsx
import { LaRoseProvider } from '@larose-ui/runtime-react';
import { Button, Card, Input } from '@larose-ui/react';
import '@larose-ui/react/styles.css';

export function App() {
  return (
    <LaRoseProvider theme="light" locale="en" permissions={['app.read']}>
      <Card title="Hello laRose">
        <Input label="Name" />
        <Button variant="primary">Save</Button>
      </Card>
    </LaRoseProvider>
  );
}
```

### Vue 3 / Svelte 5

```bash
pnpm add @larose-ui/vue @larose-ui/runtime-vue @larose-ui/styles
# or
pnpm add @larose-ui/svelte @larose-ui/runtime-svelte @larose-ui/styles
```

```ts
import '@larose-ui/styles/styles.css';
```

Meta frameworks: `@larose-ui/next`, `@larose-ui/nuxt`, `@larose-ui/sveltekit`.

## Agent workflow (implement a screen)

1. Confirm framework (React / Vue / Svelte).
2. Ensure install + CSS import + `LaRoseProvider` at app root.
3. Prefer laRose primitives: `Button`, `Input`, `SecureField`, `Card`, `Modal`, `Dialog`, `Alert`, `Badge`, `Spinner`, `EmptyState`, `Table` / `DataTable`, `Tabs`, `Select`, `Switch`.
4. Map variants: app `danger` → laRose `destructive`; Badge tones `danger` → `error`, `neutral` → `default`.
5. For passwords in **controlled** forms, prefer `Input type="password"` (or a small show/hide wrapper). Use `SecureField` **uncontrolled** (no `value`) to avoid HIG prepopulate warnings.
6. Add feature packs only when needed (see below).
7. Verify docs page for the component: `/docs/components/{id}` (kebab-case id).

## Feature packs (opt-in)

| Need | Package (React) | Key APIs |
|------|-----------------|----------|
| Authz UI | `@larose-ui/permissions-react` | `<Can>`, `<Permission>` |
| Data fetching | `@larose-ui/data-react` | `useQuery`, `DataView`, `useUndo` |
| Schema forms | `@larose-ui/forms-react` | `<Form schema={...} />` |
| Analytics | `@larose-ui/observability-react` | `ObservedForm`, funnels |
| Enterprise | `@larose-ui/enterprise-react` | `AuditedInput`, `SessionGuard` |
| AI | `@larose-ui/ai-react` | `SmartTable`, `SmartForm`, `AIProvider` |
| DevTools | `@larose-ui/devtools-react` | `<DevToolsProvider />` (dev only) |
| Toasts | `@larose-ui/runtime-react/toast` | `useToast` |

Vue/Svelte: same names with `-vue` / `-svelte`.

## LaRoseProvider checklist

```tsx
<LaRoseProvider
  theme="light" | "dark"          // or appearance="system"
  locale="en" | "ar" | …
  density="comfortable" | "compact"
  permissions={['resource.action']}
  tenantId="acme"                 // optional
  enableToasts={false}            // if app already has toast lib
  themePreset="refined" | "ocean" | "forest" | "sunset"
>
```

Tokens apply on the provider subtree (`data-lr-provider`, `--lr-*`). App-level `data-theme` CSS can coexist; laRose components read `--lr-*`.

## Docs map (agents)

Base: `https://hamdymohamedak.github.io/larose-ui`

| Topic | Path |
|-------|------|
| Home | `/` |
| Getting started | `/docs/getting-started` |
| Packages index | `/docs/packages` |
| Package detail | `/docs/packages/{id}` |
| All components | `/docs/components` |
| Component | `/docs/components/{id}` |
| Component JSON | `/components/{id}.json` |
| Guides Vue/Svelte/Next/Nuxt | `/docs/guides/vue` … `/docs/guides/nuxt` |
| Theme builder | `/docs/design/theme-builder` |
| Tokens | `/docs/design/tokens` |
| Motion | `/docs/design/motion` |
| Architecture | `/docs/architecture` |
| Accessibility | `/docs/accessibility` |
| Playground | `/docs/playground` |
| Migration | `/docs/migration` |
| Changelog | `/changelog` |

Repo markdown (clone / GitHub):

| Topic | File |
|-------|------|
| Public API | `docs/PUBLIC_API.md` |
| Architecture | `docs/architecture/ARCHITECTURE.md` |
| Runtime | `docs/runtime/RUNTIME_2.md` |
| Migration | `docs/ecosystem/MIGRATION.md` |
| AI pack | `docs/ai/AI_RUNTIME.md` |
| Contributing | `CONTRIBUTING.md` |

Full URL tables + WebMCP tools → [docs-map.md](docs-map.md).  
Package layers → [packages.md](packages.md).  
Pitfalls → [pitfalls.md](pitfalls.md).  
Cross-framework contribution rules → [engineering.md](engineering.md).

## Vite config (required in nested monorepos)

```ts
import path from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@larose-ui/react', '@larose-ui/runtime-react'],
  },
});
```

Then delete `node_modules/.vite` and restart the dev server.

## Do / Don't

| Do | Don't |
|----|-------|
| Import from `@larose-ui/react` + `@larose-ui/runtime-react` | Import `LaRoseProvider` from `@larose-ui/react` |
| Import CSS explicitly once | Skip CSS or import tokens CSS separately |
| Use `variant="destructive"` | Invent `danger` as a laRose Button variant |
| Use `SecureField` without controlled `value` | Bind `value={password}` on SecureField every keystroke |
| Add packs only when needed | Install all `@larose-ui/*` packages |
| Follow `/docs/components/{id}` | Guess prop names without checking docs/types |

## Migration snippets (v1+)

- `LaRoseProvider`: `@larose-ui/runtime-react`
- Tokens: `--ui-color-*` → `--lr-color-*`
- Authz: replace inline role checks with `<Can permission="…">`
- Toasts: `useToast` from `@larose-ui/runtime-react/toast`

## Contributing to the library (agents editing this repo)

1. Branch from **`dev`**, PR to **`dev`**.
2. Scaffold: `make contribute NAME=X PACKAGE=all` then `make parity-sync`.
3. Add changeset: `pnpm changeset` (or write `.changeset/*.md`).
4. Quality: `pnpm test && pnpm run doctor`.
5. Behavioral parity rules: [engineering.md](engineering.md).

## Additional resources

- [docs-map.md](docs-map.md) — every docs URL + WebMCP tool names
- [packages.md](packages.md) — public vs internal packages
- [pitfalls.md](pitfalls.md) — Invalid hook call, CSS, SecureField, dual toasts
- [engineering.md](engineering.md) — cross-framework component contracts for contributors
