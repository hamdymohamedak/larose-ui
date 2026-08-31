# laRose

UI platform for modern SaaS applications — React components, runtime providers, and intelligence primitives (data, forms, permissions).

## Table of contents

- [Quick start](#quick-start)
- [Getting started](#getting-started)
- [Packages](#packages)
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

### Install

```bash
pnpm add @larose-ui/runtime @larose-ui/react @larose-ui/tokens
```

Add intelligence packages as needed:

```bash
pnpm add @larose-ui/data @larose-ui/forms @larose-ui/permissions
pnpm add @larose-ui/observability @larose-ui/enterprise @larose-ui/ai
```

### Minimal app

```tsx
import { LaRoseProvider } from '@larose-ui/runtime';
import { Button, Card, Input } from '@larose-ui/react';
import '@larose-ui/tokens/styles.css';

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

Toasts are available via `@larose-ui/runtime/toast`:

```tsx
import { LaRoseProvider } from '@larose-ui/runtime';
import { useToast } from '@larose-ui/runtime/toast';

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
| Runtime | `@larose-ui/runtime` | `LaRoseProvider`, theme, i18n, network, offline, `useRuntime` |
| Runtime toasts | `@larose-ui/runtime/toast` | `useToast`, `ToastProvider` |
| Components | `@larose-ui/react` | Button, Input, Modal, Dialog, Card, … |
| Permissions | `@larose-ui/permissions` | `<Can>`, `<Permission>`, `<Explainable>` |
| Data | `@larose-ui/data` | `useQuery`, `DataView`, `SelfHealingError`, `useUndo` |
| Forms | `@larose-ui/forms` | `<Form schema={...} />` |
| Observability | `@larose-ui/observability` | `ObservedForm`, funnel metrics |
| Enterprise | `@larose-ui/enterprise` | `AuditedInput`, `VersionProvider`, `SessionGuard` |
| AI | `@larose-ui/ai` | `SmartTable`, `SmartForm`, custom `AIAdapter` |
| DevTools | `@larose-ui/devtools` | `<DevToolsProvider />` (dev only) |

See `apps/playground/stories/EmployeeCRUD.stories.tsx` for a full CRUD example with `DataView`, `Can`, `Form`, and `useUndo`.

### Storybook

```bash
pnpm dev   # http://localhost:6006
```

## Packages

| Package | Description |
|---------|-------------|
| `@larose-ui/core` | Types, async state machines, error classification |
| `@larose-ui/tokens` | Runtime design tokens with density and theming |
| `@larose-ui/themes` | Named theme presets and tenant branding |
| `@larose-ui/react` | React components with production UI states |
| `@larose-ui/network` | Network condition detection (online/offline/slow) |
| `@larose-ui/offline` | Offline request queue with sync and conflict handling |
| `@larose-ui/runtime` | Provider tree — theme, i18n, network, offline, responsive |
| `@larose-ui/permissions` | Can, Permission, RBAC/ABAC authorization UI |
| `@larose-ui/data` | useQuery, useMutation, DataView, self-healing errors, undo |
| `@larose-ui/forms` | Schema-driven forms with conditional fields |
| `@larose-ui/observability` | Event tracking, funnel metrics, rage click detection |
| `@larose-ui/contracts` | UI/API contract validation |
| `@larose-ui/migration` | Deprecation scanning and migration reports |
| `@larose-ui/testing` | `renderWithLaRose()`, test matrix utilities |
| `@larose-ui/cli` | `larose doctor`, `migrate`, `generate` |
| `@larose-ui/devtools` | In-app runtime inspector (dev only) |
| `@larose-ui/enterprise` | Audit trails, version compatibility, UI schema IaC |
| `@larose-ui/ai` | SmartTable, SmartForm, pluggable AI adapters |
| `@larose-ui/accessibility` | Component source a11y scanner |

## Usage

```tsx
import { LaRoseProvider } from '@larose-ui/runtime';
import { DataView } from '@larose-ui/data';
import { Can } from '@larose-ui/permissions';
import { Button, Card } from '@larose-ui/react';
import '@larose-ui/tokens/styles.css';

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

## Documentation

| Topic | Location |
|-------|----------|
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

- Import `LaRoseProvider` from `@larose-ui/runtime` (not `@larose-ui/react`)
- Rename `--ui-color-*` tokens to `--lr-color-*`
- Replace inline role checks with `<Can permission="...">`

Details: [`docs/ecosystem/MIGRATION.md`](docs/ecosystem/MIGRATION.md)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for setup, branch workflow, quality checks, and the changeset release process.

Quick start: Node.js 20+, pnpm 9, then `pnpm install`, `pnpm build`, `make test-all`. Open PRs against **`dev`**; published package changes need a changeset (`pnpm changeset`).

## License

MIT
