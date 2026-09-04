# Framework Neutrality Audit

Updated after `*-react` rename + runtime network/offline parity.

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
| Runtime (network, offline, AdaptiveTable, i18n, env, features) | `runtime-react` | `runtime-vue` | `runtime-svelte` |
| DevTools | `devtools-react` (+ Fiber) | `devtools-vue` | `devtools-svelte` |
| Meta | `next` | `nuxt` | `sveltekit` |

## Intentional asymmetries

1. React Fiber inspector only in `devtools-react`
2. React `runtime-react` still has fuller toast/theme/accelerator composition with `@larose-ui/react`
3. Contracts authoring still generated from React UI index (JSON contracts are neutral)

## Enforce

```bash
pnpm check:framework-neutrality
```
