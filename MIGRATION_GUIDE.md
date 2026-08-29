# laRose Migration Guide

Step-by-step upgrades between laRose versions.

## Deprecation policy

1. **Minor version** — deprecate with console/runtime warnings
2. **One major cycle** — deprecated API still works
3. **Next major** — removed with codemod provided

Detection and fixes: `larose migrate`, `larose doctor`, and `@larose/migration` codemods. Token renames ship with `@larose/tokens/legacy-aliases.css` for one major cycle.

## Quick commands

```bash
# Scan for deprecated patterns (includes Storybook / apps/playground)
pnpm exec node packages/cli/dist/cli.js migrate --to 1.0.0

# Apply safe automated fixes
pnpm exec node packages/cli/dist/cli.js migrate --to 1.0.0 --apply

# Full quality check after migration
pnpm run doctor
```

## v0.x → v1.0

### 1. Import `LaRoseProvider` from runtime

**Before**

```tsx
import { LaRoseProvider, Button } from '@larose/react';
```

**After**

```tsx
import { LaRoseProvider } from '@larose/runtime';
import { Button } from '@larose/react';
```

**Automated:** yes (`larose migrate --apply`)

---

### 2. Rename design tokens

**Before**

```css
.card {
  color: var(--ui-color-primary);
  background: var(--ui-color-surface);
}
```

**After**

```css
.card {
  color: var(--lr-color-primary);
  background: var(--lr-color-surface);
}
```

**Transitional:** import legacy aliases while migrating:

```tsx
import '@larose/tokens/styles.css';
import '@larose/tokens/legacy-aliases.css'; // temporary — remove before v2
```

**Automated:** yes (`larose migrate --apply` renames in source files)

---

### 3. Replace inline role checks

**Before**

```tsx
if (user.role === 'admin') {
  return <DeleteButton />;
}
```

**After**

```tsx
import { Can } from '@larose/permissions';

<Can permission="employees.delete">
  <DeleteButton />
</Can>
```

**Automated:** no — requires manual refactor (reported by `larose migrate`)

---

### 4. Replace deprecated hooks

**Before**

```tsx
import { useLaRose } from '@larose/runtime';

const { theme } = useLaRose();
```

**After**

```tsx
import { useTheme } from '@larose/runtime';

const { theme } = useTheme();
```

**Runtime warning:** `useLaRose()` logs a one-time dev warning pointing to `useTheme()`.

---

## Validating your migration

1. Run `pnpm run doctor` — must pass with zero errors
2. Run `pnpm test` and `pnpm a11y`
3. Smoke-test Storybook: `pnpm dev` → **Platform/Full Demo**

## Breaking changes in v1.0

| Change | Migration |
|--------|-----------|
| `LaRoseProvider` removed from `@larose/react` | Import from `@larose/runtime` |
| `--ui-color-*` tokens removed | Use `--lr-color-*` or legacy aliases temporarily |
| Inline `user.role` checks | Use `<Can permission="...">` |
| `useLaRose()` deprecated | Use `useTheme()` |

See [CHANGELOG.md](./CHANGELOG.md) for the full release history.
