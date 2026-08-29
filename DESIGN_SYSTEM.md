# laRose Design System

## Principles

1. **States are first-class** — every component handles loading, error, empty, disabled, and more
2. **Tokens over hardcoded values** — all visual properties flow from runtime tokens
3. **Density is systemic** — compact/comfortable/spacious affects all components consistently
4. **Accessibility is default** — not an optional addon
5. **Tenant branding at runtime** — no rebuild for rebrand

## Token Categories

### Color

```text
--lr-color-primary
--lr-color-primary-hover
--lr-color-primary-active
--lr-color-secondary
--lr-color-success
--lr-color-warning
--lr-color-error
--lr-color-info
--lr-color-background
--lr-color-surface
--lr-color-surface-elevated
--lr-color-border
--lr-color-text
--lr-color-text-muted
--lr-color-text-inverse
```

Semantic naming — components never reference raw hex values.

### Typography

```text
--lr-font-family-sans
--lr-font-family-mono
--lr-font-size-xs | sm | md | lg | xl | 2xl
--lr-font-weight-normal | medium | semibold | bold
--lr-line-height-tight | normal | relaxed
```

### Spacing

```text
--lr-space-1 through --lr-space-12
```

Scaled by density multiplier.

### Radius

```text
--lr-radius-sm | md | lg | full
```

### Shadow

```text
--lr-shadow-sm | md | lg
```

### Motion

```text
--lr-duration-fast | normal | slow
--lr-easing-default | bounce | sharp
```

Respects `prefers-reduced-motion`.

## Density System

| Density | Multiplier | Use Case |
|---------|------------|----------|
| Compact | 0.85 | Admin dashboards |
| Comfortable | 1.0 | Default user UI |
| Spacious | 1.15 | Accessibility preference |

Affects: padding, font size, gap, min touch target (44px minimum enforced at spacious).

## Theme Modes

- **Light** — default
- **Dark** — inverted surfaces, adjusted contrast
- **Tenant override** — brand colors applied at runtime

## Component Anatomy

Every component follows:

```text
[Root] — layout + data attributes
  [Icon] — optional, decorative or semantic
  [Content] — label/text
  [Indicator] — loading spinner, error icon, etc.
```

### Data Attributes

Components expose state via `data-*` for styling and testing:

```html
<button data-state="loading" data-variant="primary" data-size="md">
```

### Variants

Standard variant prop pattern:

```text
variant: primary | secondary | outline | ghost | destructive
size: sm | md | lg
```

## UI State Matrix

Every major component supports:

| State | Visual | Behavior |
|-------|--------|----------|
| Default | Normal appearance | Interactive |
| Loading | Spinner/skeleton | Disabled interaction |
| Success | Success indicator | Optional auto-reset |
| Error | Error styling + message | Retry available |
| Empty | Placeholder content | CTA to create |
| Disabled | Muted, no pointer | `aria-disabled` |
| Read Only | Display only | No edit affordance |
| Unauthorized | Hidden or forbidden | Explainable message |

## Component Catalog

### `@larose/react` (foundation)

- Button — variants, loading, disabled, error
- Input, Textarea, Select — validation states, read-only, disabled
- DatePicker, TimePicker, DateRangePicker — token-styled native date/time inputs
- Checkbox, Radio, Switch, Progress
- Tooltip, Toast (`ToastProvider`, `useToast`), Tabs
- Drawer, Popover, Breadcrumb
- Accordion, Pagination, DataTable
- FileUpload, Sidebar, Header, CommandPalette (`useCommandPaletteShortcut`)
- Spinner, Alert, Modal, Dialog, Card, Badge, Skeleton, EmptyState, AsyncButton

### Intelligence layer (separate packages)

- `<Form />` — schema-driven forms (`@larose/forms`; uses `@larose/react` Textarea/Select)
- `<DataView />`, `useQuery`, `useMutation` — `@larose/data`
- `<Can />` — `@larose/permissions`
- `<AdaptiveTable />` — responsive table layouts (`@larose/runtime`)
- `<SmartTable />`, `<SmartForm />` — `@larose/ai`

## Responsive Behavior

Components use container-aware layouts where possible. `AdaptiveTable` in `@larose/runtime` switches table → cards → priority layout by breakpoint context.

## Internationalization

- Arabic (RTL), English, German at launch
- All user-facing strings via i18n keys
- RTL flips layout direction at provider level

## Anti-Patterns

❌ Hardcoded colors in components  
❌ Boolean props like `isLoading && isError && isDisabled`  
❌ Inline permission checks (`user.role === 'admin'`)  
❌ Components that only handle the happy path  
❌ Rebuilding for tenant theme changes
