# laRose public vs internal packages

## Install these (public product story)

| Layer | Packages |
|-------|----------|
| UI | `@larose-ui/react`, `@larose-ui/vue`, `@larose-ui/svelte` |
| Runtime | `@larose-ui/runtime-react`, `@larose-ui/runtime-vue`, `@larose-ui/runtime-svelte` |
| Meta | `@larose-ui/next`, `@larose-ui/nuxt`, `@larose-ui/sveltekit` |
| Styles | `@larose-ui/styles` (React may use `@larose-ui/react/styles.css` only) |
| Branding | `@larose-ui/themes` |
| Features | `data-*`, `forms-*`, `permissions-*`, `observability-*`, `enterprise-*`, `ai-*`, `testing-*`, `devtools-*` (pick `*-react` / `*-vue` / `*-svelte`) |
| Tooling | `@larose-ui/cli` |

### Minimal installs

```bash
# React
pnpm add @larose-ui/react @larose-ui/runtime-react

# Vue
pnpm add @larose-ui/vue @larose-ui/runtime-vue @larose-ui/styles

# Svelte
pnpm add @larose-ui/svelte @larose-ui/runtime-svelte @larose-ui/styles
```

## Do not import in app code (internal)

These may appear in `node_modules` as transitive deps — **do not** import them from application source:

- `@larose-ui/core`, `@larose-ui/tokens`, `@larose-ui/primitives`
- `@larose-ui/component-logic`, `@larose-ui/liquid-glass-core`
- `@larose-ui/runtime-core`, `@larose-ui/network`, `@larose-ui/offline`
- All `*-core` feature engines (`data-core`, `forms-core`, …)
- `@larose-ui/contracts`, `@larose-ui/accessibility`, `@larose-ui/migration`, `@larose-ui/quality-core`

Policy: `docs/PUBLIC_API.md`. Keyword `larose-internal` / `"larose": { "publicApi": false }`.

## Runtime entry points (React)

| Import | Use |
|--------|-----|
| `@larose-ui/runtime-react` | `LaRoseProvider`, `useRuntime`, theme/i18n/network/offline |
| `@larose-ui/runtime-react/toast` | `useToast`, `ToastProvider` |
| `@larose-ui/react` | Components (`Button`, `Card`, `Input`, …) + `./styles.css` |
| `@larose-ui/react/styles.css` | Tokens + component CSS (preferred for React) |
| `@larose-ui/styles/styles.css` | Same stylesheet for Vue/Svelte/meta |

## Version skew note

npm may publish UI packages (e.g. `0.3.x`) separately from runtime (`2.x`). Follow peerDependencies: `@larose-ui/runtime-react` peers `@larose-ui/react >=0.3.2`, `react`/`react-dom` `>=18`. Always install matching latest from npm unless the user pins versions.
