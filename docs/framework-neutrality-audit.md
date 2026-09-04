# Framework Neutrality Audit

Updated after contracts-as-source-of-truth + runtime toast/theme/accelerator parity.

## Naming convention

```text
*-core              shared logic (no framework)
*-react / *-vue / *-svelte   equal adapters
```

React is never the bare package name for platform adapters:

| Old | New |
|-----|-----|
| `@larose-ui/data` | `@larose-ui/data-react` |
| `@larose-ui/forms` | `@larose-ui/forms-react` |
| `@larose-ui/permissions` | `@larose-ui/permissions-react` |
| `@larose-ui/observability` | `@larose-ui/observability-react` |
| `@larose-ui/ai` | `@larose-ui/ai-react` |
| `@larose-ui/enterprise` | `@larose-ui/enterprise-react` |
| `@larose-ui/testing` | `@larose-ui/testing-react` |
| `@larose-ui/runtime` | `@larose-ui/runtime-react` |
| `@larose-ui/devtools` | `@larose-ui/devtools-react` |

UI component packages stay `@larose-ui/react` / `vue` / `svelte` (framework = package name).

## Platform surface parity

| Surface | React | Vue | Svelte |
|---------|:-----:|:---:|:------:|
| AI SmartTable / SmartForm | `ai-react` | `ai-vue` | `ai-svelte` |
| Enterprise UI | `enterprise-react` | `enterprise-vue` | `enterprise-svelte` |
| Runtime (theme, toast, accelerator, network, offline, AdaptiveTable, i18n, env, features) | `runtime-react` | `runtime-vue` | `runtime-svelte` |
| DevTools | `devtools-react` (+ Fiber) | `devtools-vue` | `devtools-svelte` |
| Meta | `next` | `nuxt` | `sveltekit` |

## Intentional asymmetries

1. **React Fiber inspector** only in `devtools-react` — Vue/Svelte use `data-lr-*` DOM metadata (Fiber is React-specific).
2. **Liquid Glass / MotionProvider / Presence** remain richer on the React UI entry; shared glass cores stay framework-neutral.
3. **Contract Props sampling** may use a TypeScript `*Props` reference adapter (`--from=react|vue|svelte|auto`) when refreshing JSON. The **canonical source of truth is `contracts/components/*.json`**, not any framework index.

## Contracts

```text
Framework-neutral contract (JSON)
         │
   ┌─────┼─────┐
   ▼     ▼     ▼
React   Vue   Svelte
```

```bash
pnpm generate:contracts              # refresh from catalog; sample Props via --from=
pnpm generate:contracts --from=vue   # optional Props sample adapter
```

## Enforce

```bash
pnpm check:framework-neutrality
```
