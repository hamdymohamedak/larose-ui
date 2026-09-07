# laRose

UI platform for modern SaaS applications — React / Vue / Svelte components, runtime providers, and optional intelligence packs (data, forms, permissions).

The monorepo is split precisely for maintainers. **You only need a small public surface** to build an app.

- **Docs:** [https://hamdymohamedak.github.io/larose-ui/](https://hamdymohamedak.github.io/larose-ui/)
- **Public API surface:** [docs/PUBLIC_API.md](docs/PUBLIC_API.md)

## Table of contents

- [Quick start](#quick-start)
- [Getting started](#getting-started)
- [Public packages](#public-packages)
- [Usage](#usage)
- [Scripts](#scripts)
- [Documentation](#documentation)
- [Migration](#migration)
- [Contributing](#contributing)
- [License](#license)

## Quick start

```bash
pnpm install
pnpm build
pnpm dev          # Storybook at http://localhost:6006
pnpm demo         # Vite demo app at http://localhost:5173
pnpm webdocs      # Documentation site at http://localhost:5174
pnpm test
pnpm run doctor   # quality gates
```

## Getting started

### Install (React)

```bash
pnpm add @larose-ui/runtime-react @larose-ui/react
```

Import styles once (`@larose-ui/react/styles.css` — tokens included). That is enough for a working app.

Optional feature packs (only if you need them):

```bash
pnpm add @larose-ui/data-react @larose-ui/forms-react @larose-ui/permissions-react
pnpm add @larose-ui/observability-react @larose-ui/enterprise-react @larose-ui/ai-react
```

### Minimal app

```tsx
import { LaRoseProvider } from '@larose-ui/runtime-react';
import { Button, Card, Input } from '@larose-ui/react';
import '@larose-ui/react/styles.css';

export function App() {
  return (
    <LaRoseProvider theme="light" locale="en" permissions={['app.read']}>
      <Card title="Hello laRose">
        <Input label="Name" />
        <Button>Save</Button>
      </Card>
    </LaRoseProvider>
  );
}
```

Toasts are available via `@larose-ui/runtime-react/toast`:

```tsx
import { useToast } from '@larose-ui/runtime-react/toast';

function SaveButton() {
  const { toast } = useToast();
  return (
    <button
      onClick={() =>
        toast({ title: 'Saved', message: 'Changes stored.', variant: 'success' })
      }
    >
      Save
    </button>
  );
}
```

### Layer composition

| Layer | Package | Key APIs |
|-------|---------|----------|
| Runtime | `@larose-ui/runtime-react` | `LaRoseProvider`, theme, i18n, network, offline, `useRuntime` |
| Runtime toasts | `@larose-ui/runtime-react/toast` | `useToast`, `ToastProvider` |
| Components | `@larose-ui/react` | Button, Input, Modal, Dialog, Card, … |
| Permissions | `@larose-ui/permissions-react` | `<Can>`, `<Permission>`, `<Explainable>` |
| Data | `@larose-ui/data-react` | `useQuery`, `DataView`, `SelfHealingError`, `useUndo` |
| Forms | `@larose-ui/forms-react` | `<Form schema={...} />` |
| Observability | `@larose-ui/observability-react` | `ObservedForm`, funnel metrics |
| Enterprise | `@larose-ui/enterprise-react` | `AuditedInput`, `VersionProvider`, `SessionGuard` |
| AI | `@larose-ui/ai-react` | `SmartTable`, `SmartForm`, custom `AIAdapter` |
| DevTools | `@larose-ui/devtools-react` | `<DevToolsProvider />` (dev only) |

See `apps/playground/stories/EmployeeCRUD.stories.tsx` for a full CRUD example with `DataView`, `Can`, `Form`, and `useUndo`.

### Storybook

```bash
pnpm dev   # http://localhost:6006
```

## Public packages

Start here. Internal building blocks (`core`, `primitives`, `*-core`, …) stay in the monorepo and on npm for dependencies, but they are **not** the product story.

| Layer | Packages |
|-------|----------|
| UI | `@larose-ui/react`, `@larose-ui/vue`, `@larose-ui/svelte` |
| Runtime | `@larose-ui/runtime-react`, `@larose-ui/runtime-vue`, `@larose-ui/runtime-svelte` |
| Meta | `@larose-ui/next`, `@larose-ui/nuxt`, `@larose-ui/sveltekit` |
| Stylesheets | `@larose-ui/styles` (tokens bundled; React: `@larose-ui/react/styles.css`) |
| Branding | `@larose-ui/themes` |
| Features | `@larose-ui/data-*`, `forms-*`, `permissions-*`, `observability-*`, `enterprise-*`, `ai-*`, `testing-*`, `devtools-*` |
| Tooling | `@larose-ui/cli` |

Full policy and golden rule: [`docs/PUBLIC_API.md`](docs/PUBLIC_API.md).

## Usage

```tsx
import { LaRoseProvider } from '@larose-ui/runtime-react';
import { DataView } from '@larose-ui/data-react';
import { Can } from '@larose-ui/permissions-react';
import { Button, Card } from '@larose-ui/react';
import '@larose-ui/react/styles.css';

function App() {
  return (
    <LaRoseProvider
      theme="light"
      locale="en"
      permissions={['employees.read']}
      tenantId="acme"
      observabilityDebug
    >
      <Can permission="employees.read">
        <Card title="Employees">
          <DataView url="/api/employees">
            {(data) => <pre>{JSON.stringify(data, null, 2)}</pre>}
          </DataView>
        </Card>
      </Can>
    </LaRoseProvider>
  );
}
```

## Scripts

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Storybook playground |
| `pnpm demo` | Vite demo app |
| `pnpm webdocs` | laRose UI documentation site (use `pnpm run webdocs`, not `pnpm docs`) |
| `pnpm build` | Build all packages |
| `pnpm test` | Run all tests |
| `pnpm lint` | ESLint on packages and apps |
| `pnpm run doctor` | Deprecations, contracts, a11y |
| `pnpm a11y` | Scan component sources for a11y issues |
| `pnpm migrate` | Dry-run migration report |
| `pnpm migrate:apply` | Apply safe codemods |
| `pnpm sync:publish-metadata` | Sync public/internal npm metadata |
| `pnpm generate:readmes` | Regenerate package READMEs from public surface |
| `pnpm verify:publish` | Verify publish readiness + public-surface flags |

## Documentation

- [Web docs](https://hamdymohamedak.github.io/larose-ui/)

| Topic | Location |
|-------|----------|
| Public API surface | [`docs/PUBLIC_API.md`](docs/PUBLIC_API.md) |
| Architecture | [`docs/architecture/ARCHITECTURE.md`](docs/architecture/ARCHITECTURE.md) |
| Runtime | [`docs/runtime/RUNTIME_2.md`](docs/runtime/RUNTIME_2.md) |
| Observability | [`docs/observability/OBSERVABILITY_2.md`](docs/observability/OBSERVABILITY_2.md) |
| Migration & CLI | [`docs/ecosystem/MIGRATION.md`](docs/ecosystem/MIGRATION.md) |
| Quality engine | [`docs/quality/QUALITY_ENGINE.md`](docs/quality/QUALITY_ENGINE.md) |
| Roadmap | [`docs/ROADMAP.md`](docs/ROADMAP.md) |

Each package under `packages/*/README.md` has install instructions and a quick start.

## Migration

```bash
pnpm migrate              # scan for deprecated patterns
pnpm migrate:apply        # apply safe automated fixes
pnpm run doctor           # verify after migration
```

Common v1.0 changes:

- Import `LaRoseProvider` from `@larose-ui/runtime-react` (not `@larose-ui/react`)
- Rename `--ui-color-*` tokens to `--lr-color-*`
- Replace inline role checks with `<Can permission="...">`

Details: [`docs/ecosystem/MIGRATION.md`](docs/ecosystem/MIGRATION.md)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for setup, branch workflow, quality checks, and the changeset release process.

Quick start: Node.js 20+, pnpm 9, then `pnpm install`, `pnpm build`, `make test-all`. Open PRs against **`dev`**; published package changes need a changeset (`pnpm changeset`).

## License

MIT
