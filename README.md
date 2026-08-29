# laRose

**The UI Operating System for Modern SaaS Applications**

laRose is not a traditional component library. It is a full UI platform with runtime intelligence, observability, enterprise patterns, and DevOps built in.

## Quick Start

```bash
pnpm install
pnpm build
pnpm dev          # Storybook at http://localhost:6006
pnpm demo         # Vite demo app at http://localhost:5173
pnpm test
pnpm run doctor   # quality gates
```

See [GETTING_STARTED.md](./GETTING_STARTED.md) for integration patterns.

## Packages (20)

| Package | Description |
|---------|-------------|
| `@larose/core` | Types, async state machines, error classification |
| `@larose/tokens` | Runtime design tokens with density + theming |
| `@larose/themes` | Named theme presets and tenant branding |
| `@larose/react` | React components with production UI states |
| `@larose/network` | Network condition detection (online/offline/slow) |
| `@larose/offline` | Offline request queue with sync + conflict handling |
| `@larose/runtime` | Full provider tree — theme, i18n, network, offline, responsive |
| `@larose/permissions` | Can, Permission, RBAC/ABAC authorization UI |
| `@larose/data` | useQuery, useMutation, DataView, self-healing errors, undo |
| `@larose/forms` | Schema-driven forms with conditional fields |
| `@larose/observability` | Event tracking, funnel metrics, rage click detection |
| `@larose/contracts` | UI/API contract validation |
| `@larose/migration` | Deprecation scanning and migration reports |
| `@larose/testing` | `renderWithLaRose()`, test matrix utilities |
| `@larose/cli` | `larose doctor`, `migrate`, `generate` |
| `@larose/devtools` | In-app runtime inspector (dev only) |
| `@larose/enterprise` | Audit trails, version compatibility, UI schema IaC, security |
| `@larose/ai` | SmartTable, SmartForm, pluggable AI adapters |
| `@larose/accessibility` | Component source a11y scanner |
| `@larose/playground` | Storybook component playground (private) |
| `@larose/demo` | Vite demo app — production-style integration (private) |

## Usage

```tsx
import { LaRoseProvider } from '@larose/runtime';
import { DataView } from '@larose/data';
import { Can } from '@larose/permissions';
import { Button, Card } from '@larose/react';
import '@larose/tokens/styles.css';

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
| `pnpm build` | Build all packages |
| `pnpm test` | Run all tests |
| `pnpm run doctor` | Bundle budgets, deprecations, contracts, a11y |
| `pnpm check-budgets` | Fail on bundle size overages |
| `pnpm a11y` | Scan component sources for a11y issues |
| `pnpm changeset` | Create a changeset for release |

## Architecture

- [ARCHITECTURE.md](./ARCHITECTURE.md) — platform design
- [GETTING_STARTED.md](./GETTING_STARTED.md) — integration guide
- [CONTRIBUTING.md](./CONTRIBUTING.md) — how to contribute
- [PUBLISHING.md](./PUBLISHING.md) — npm release process
- [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)
- [PACKAGE_STRUCTURE.md](./PACKAGE_STRUCTURE.md) — monorepo layout
- [SECURITY.md](./SECURITY.md) — security-aware UI patterns
- [DEVOPS_STRATEGY.md](./DEVOPS_STRATEGY.md) — CI, releases, quality gates
- [CHANGELOG.md](./CHANGELOG.md) — release history
- [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) — version upgrade steps

## License

MIT
