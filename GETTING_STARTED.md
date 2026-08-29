# Getting Started with laRose

laRose is a UI platform — not just components. This guide shows how to compose the layers in a real app.

## Install

```bash
pnpm add @larose/runtime @larose/react @larose/tokens
```

For intelligence, observability, and enterprise features, add packages as needed:

```bash
pnpm add @larose/data @larose/forms @larose/permissions
pnpm add @larose/observability @larose/enterprise @larose/ai
```

## Minimal app

```tsx
import { LaRoseProvider } from '@larose/runtime';
import { Button, Card, Input } from '@larose/react';
import '@larose/tokens/styles.css';

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

`LaRoseProvider` includes `ToastProvider` by default. Show notifications with `useToast()`:

```tsx
import { LaRoseProvider, useToast } from '@larose/runtime';

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

## Layer composition

| Layer | Package | Key APIs |
|-------|---------|----------|
| Runtime | `@larose/runtime` | `LaRoseProvider`, `useToast`, theme, i18n, network, offline |
| Components | `@larose/react` | Button, Input, Modal, Dialog, Card, … |
| Permissions | `@larose/permissions` | `<Can>`, `<Permission>`, `<Explainable>` |
| Data | `@larose/data` | `useQuery`, `DataView`, `SelfHealingError`, `useUndo` |
| Forms | `@larose/forms` | `<Form schema={...} />` |
| Observability | `@larose/observability` | `ObservedForm`, funnel metrics, rage click detection |
| Enterprise | `@larose/enterprise` | `AuditedInput`, `VersionProvider`, `SessionGuard` |
| AI | `@larose/ai` | `SmartTable`, `SmartForm`, custom `AIAdapter` |
| DevTools | `@larose/devtools` | `<DevToolsProvider />` (dev only) |

## Employee CRUD pattern

See `apps/playground/stories/EmployeeCRUD.stories.tsx` for the reference implementation:

- `DataView` for list loading/error/empty states
- `Can` for permission-gated actions
- `Form` with conditional fields
- `useUndo` for destructive actions

## Quality gates

```bash
pnpm build
pnpm test
pnpm run doctor      # bundle budgets, deprecations, contracts, a11y
pnpm check-budgets
pnpm a11y            # component source a11y scan
```

## Publishing

See [PUBLISHING.md](./PUBLISHING.md) for npm release steps (`pnpm changeset`, `pnpm verify:publish`, `pnpm release:publish`).

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development workflow, quality gates, and pull request guidelines.

## Storybook

```bash
pnpm dev   # http://localhost:6006
```

Explore stories by layer: **Platform/Full Demo**, **Intelligence/**, **Enterprise/**, **AI/**, **Observability/**, **DevOps/**.
