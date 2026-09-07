# Public API surface

laRose keeps a **precise internal monorepo graph**, but the **product story** is intentionally small.

## Golden rule

> If a package has no clear end user, and its only consumer is another `@larose-ui/*` package, do **not** make it part of the public product story.

Those packages may still be published on npm (so public packages can depend on them). They are marked `[Internal]` and documented as advanced.

Product docs: [https://hamdymohamedak.github.io/larose-ui/](https://hamdymohamedak.github.io/larose-ui/)

## Start here (not 56 names)

| Layer | Install these |
|-------|----------------|
| **UI** | `@larose-ui/react` · `@larose-ui/vue` · `@larose-ui/svelte` |
| **Runtime** | `@larose-ui/runtime-react` · `@larose-ui/runtime-vue` · `@larose-ui/runtime-svelte` |
| **Meta** | `@larose-ui/next` · `@larose-ui/nuxt` · `@larose-ui/sveltekit` |
| **Stylesheets** | `@larose-ui/styles` *(tokens bundled; React can use `@larose-ui/react/styles.css`)* |
| **Branding** | `@larose-ui/themes` |
| **Features** | `@larose-ui/data-*` · `forms-*` · `permissions-*` · `observability-*` · `enterprise-*` · `ai-*` · `testing-*` · `devtools-*` |
| **Tooling** | `@larose-ui/cli` |

### Minimal React app

```bash
pnpm add @larose-ui/runtime-react @larose-ui/react
```

```tsx
import { LaRoseProvider } from '@larose-ui/runtime-react';
import { Button, Card } from '@larose-ui/react';
import '@larose-ui/react/styles.css';
```

Add feature packs only when you need them (`data-react`, `forms-react`, …).

### Minimal Vue / Svelte app

```bash
pnpm add @larose-ui/runtime-vue @larose-ui/vue @larose-ui/styles
# or runtime-svelte + svelte + styles
```

```ts
import '@larose-ui/styles/styles.css';
```

## Internal on purpose

Examples of packages that stay **internal** to the product story:

- `core`, `tokens`, `primitives`, `component-logic`, `liquid-glass-core`
- `runtime-core`, `network`, `offline`
- `*-core` feature engines (`data-core`, `forms-core`, …)
- `contracts`, `accessibility`, `migration`, `quality-core`

App code should almost never import these directly. Extending laRose itself? Then they are fair game.

## How metadata is enforced

Source of truth: [`scripts/public-surface.mjs`](../scripts/public-surface.mjs)

Each package.json gets:

```json
"larose": { "publicApi": true, "layer": "ui" }
```

Internal packages get `"publicApi": false`, keyword `larose-internal`, and a description prefixed with `[Internal]`.

Regenerate:

```bash
pnpm sync:publish-metadata
pnpm generate:readmes
pnpm verify:publish
```

## Why not delete internal packages from npm?

Public packages depend on them. Keeping the monorepo split precise preserves framework neutrality and tree-shaking. Hiding them from the **story** (README, keywords, doctor messaging) is enough to stop the 56-name confusion without a breaking publish rewrite.
