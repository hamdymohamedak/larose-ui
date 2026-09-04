# Migration & CLI

# Migration & Ecosystem (Phase 6)

Tools for upgrading laRose apps and coordinating monorepo releases.

## Codemods

Safe automated transforms via `larose migrate --apply`:

| Transform | Description |
|-----------|-------------|
| Token rename | `--ui-color-*` → `--lr-color-*` |
| Provider import | `LaRoseProvider` from `@larose-ui/react` → `@larose-ui/runtime-react` |
| Toast import | `useToast` from `@larose-ui/runtime-react` → `@larose-ui/runtime-react/toast` |

```bash
pnpm migrate              # dry-run report
pnpm migrate:apply        # apply codemods
```

## Generators

Runtime 2.0-aware scaffolds:

```bash
larose generate form Employee ./EmployeeForm.tsx
larose generate page Employees ./EmployeesPage.tsx
larose generate feature EmployeeList ./EmployeeListFeature.tsx
```

Generated features include `LaRoseProvider`, permissions, journey tracking, DevTools, and SmartTable where appropriate.

## Release intelligence

```bash
pnpm release:report
larose release --json
```

Reports version alignment across publishable `@larose-ui/*` packages, publish metadata gaps, and release recommendations.

## Package

All APIs live in `@larose-ui/migration` and are re-exported through the `larose` CLI.
