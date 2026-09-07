---
"@larose-ui/accessibility": patch
"@larose-ui/ai-core": patch
"@larose-ui/ai-react": patch
"@larose-ui/ai-svelte": patch
"@larose-ui/ai-vue": patch
"@larose-ui/cli": patch
"@larose-ui/component-logic": patch
"@larose-ui/contracts": patch
"@larose-ui/core": patch
"@larose-ui/data-core": patch
"@larose-ui/data-react": patch
"@larose-ui/data-svelte": patch
"@larose-ui/data-vue": patch
"@larose-ui/devtools-core": patch
"@larose-ui/devtools-react": patch
"@larose-ui/devtools-svelte": patch
"@larose-ui/devtools-vue": patch
"@larose-ui/enterprise-core": patch
"@larose-ui/enterprise-react": patch
"@larose-ui/enterprise-svelte": patch
"@larose-ui/enterprise-vue": patch
"@larose-ui/forms-core": patch
"@larose-ui/forms-react": patch
"@larose-ui/forms-svelte": patch
"@larose-ui/forms-vue": patch
"@larose-ui/liquid-glass-core": patch
"@larose-ui/migration": patch
"@larose-ui/network": patch
"@larose-ui/next": patch
"@larose-ui/nuxt": patch
"@larose-ui/observability-core": patch
"@larose-ui/observability-react": patch
"@larose-ui/observability-svelte": patch
"@larose-ui/observability-vue": patch
"@larose-ui/offline": patch
"@larose-ui/permissions-core": patch
"@larose-ui/permissions-react": patch
"@larose-ui/permissions-svelte": patch
"@larose-ui/permissions-vue": patch
"@larose-ui/primitives": patch
"@larose-ui/quality-core": patch
"@larose-ui/react": patch
"@larose-ui/runtime-core": patch
"@larose-ui/runtime-react": patch
"@larose-ui/runtime-svelte": patch
"@larose-ui/runtime-vue": patch
"@larose-ui/styles": patch
"@larose-ui/svelte": patch
"@larose-ui/sveltekit": patch
"@larose-ui/testing-core": patch
"@larose-ui/testing-react": patch
"@larose-ui/testing-svelte": patch
"@larose-ui/testing-vue": patch
"@larose-ui/themes": patch
"@larose-ui/tokens": patch
"@larose-ui/vue": patch
---

Clarify the public npm surface and ship the one-CSS install story.

- Mark building-block packages as internal (still published for transitive installs; not product docs).
- Bundle design tokens into `@larose-ui/styles/styles.css` and `@larose-ui/react/styles.css` so apps need a single CSS import.
- Align package metadata, readmes, and docs install copy with the public vs internal split.

