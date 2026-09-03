# Framework Neutrality Audit

Generated as Phase 1 of the framework-agnostic migration (`maintenance.md`).
Updated after UI/runtime/devtools/meta parity pass.

## Target

```text
Shared cores (no React/Vue/Svelte)
        │
   ┌────┼────┐
React  Vue  Svelte   ← adapters only
```

React must be **one of three adapters**, not the foundation.

## Platform surface parity

| Surface | React | Vue | Svelte |
|---------|:-----:|:---:|:------:|
| AIProvider | yes | yes | yes |
| SmartTable / SmartForm | yes | yes | yes |
| AuditProvider + AuditedInput / AuditHistory / SchemaRenderer / SessionGuard / SensitiveAction / VersionProvider | yes | yes | yes |
| Runtime (AdaptiveTable, Responsive, Env, I18n, Features, RuntimeProvider) | `@larose-ui/runtime` | `@larose-ui/runtime-vue` | `@larose-ui/runtime-svelte` |
| DevTools panel (DOM protocol) | yes (+ Fiber) | `@larose-ui/devtools-vue` | `@larose-ui/devtools-svelte` |
| Meta-framework | `@larose-ui/next` | `@larose-ui/nuxt` | `@larose-ui/sveltekit` |

## Remaining intentional asymmetries

1. **React Fiber inspector** — only in `@larose-ui/devtools` (Vue/Svelte use `data-lr-*` DOM protocol)
2. **Full `@larose-ui/runtime` stack** — React still has Network/Offline/Toast composition; Vue/Svelte cover the shared runtime-core surfaces used by AI/enterprise
3. **Component package LOC** — adapters remain real renderers, not zero-logic shells
4. **Contracts authoring** — still generated from React index (contracts JSON are neutral)

## Enforce

```bash
pnpm check:framework-neutrality
```
