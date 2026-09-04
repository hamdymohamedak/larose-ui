# Refined design language

# Refined Design Language

> **Apple-inspired, not an Apple/macOS clone.**

The **Refined** preset is an optional design language for laRose UI. It translates principles from [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/design-principles) into a **cross-platform, token-driven system** suitable for modern SaaS products.

## Philosophy

Refined prioritizes:

- **Restraint** — calm neutrals, subtle elevation, no decorative glass everywhere
- **Hierarchy** — semantic typography, surfaces, and spacing
- **Precision** — tactile controls with subtle motion
- **Accessibility** — contrast, keyboard focus, reduced motion, RTL
- **Adaptability** — tenant branding, light/dark/system appearance

## When to use

| Use Refined | Use Default |
|-------------|-------------|
| Premium dashboards, desktop-first apps | Maximum compatibility, minimal visual opinion |
| Product teams wanting a polished native feel | Heavy tenant brand customization on base tokens |
| Internal tools with macOS-like navigation | Legacy apps that depend on current default colors |

## Quick start

```tsx
import { LaRoseProvider } from '@larose-ui/runtime-react';
import '@larose-ui/tokens/styles.css';
import '@larose-ui/react/styles.css';

<LaRoseProvider themePreset="refined" appearance="system">
  <App />
</LaRoseProvider>
```

## Surface system

Surfaces are semantic layers — not decoration.

| Surface | Use case |
|---------|----------|
| `solid` | Base panels, forms |
| `secondary` | Grouped background areas |
| `elevated` | Cards (default) |
| `floating` | Modals, dialogs |
| `glass` | Command palette, overlays (with solid fallback) |

```tsx
<Card surface="elevated" />
<Modal surface="floating" />
```

Glass uses `backdrop-filter` when supported; otherwise falls back to `--lr-surface-elevated`.

## Typography

Semantic roles map to CSS variables (`--lr-type-*`):

`display` · `largeTitle` · `title` · `headline` · `body` · `callout` · `subheadline` · `footnote` · `caption`

```tsx
import { Typography } from '@larose-ui/react';

<Typography role="largeTitle">Dashboard</Typography>
<Typography role="subheadline">Updated today</Typography>
```

Fonts use the **system stack** (`-apple-system`, `Segoe UI`, `Roboto`) — no bundled SF Pro.

## Motion

Tokens: `--lr-duration-*`, `--lr-easing-spring`, `--lr-motion-*`

Reduced motion zeroes durations via `@media (prefers-reduced-motion: reduce)`.

## Dark mode

Refined dark mode is **designed** (surfaces, glass, borders) — not a simple color invert.

Use `appearance="light" | "dark" | "system"` on `LaRoseProvider`.

## RTL & Arabic

Use logical properties (`border-inline`, `padding-inline`, `text-align: start`). laRose runtime supports `locale="ar"` with RTL direction.

## Tenant branding

`brandColors` merge on top of the preset — primary/accent can change without breaking hierarchy.

## Apple references vs laRose decisions

| Apple HIG principle | laRose implementation |
|---------------------|----------------------|
| Materials & vibrancy | `--lr-surface-glass-*` tokens + optional `glass` surface |
| Typography hierarchy | Semantic `--lr-type-*` roles |
| Purposeful motion | `--lr-motion-*`, reduced-motion support |
| macOS spacious layout | Density system + refined spacing tokens |
| SF Symbols | **Not bundled** — use Lucide/custom via `<Icon />` when added |

## Legal

Do not redistribute SF Pro, SF Arabic, SF Symbols, or Apple UI assets in laRose packages. This preset derives **design principles only**.

## Related packages

- `@larose-ui/tokens` — primitives and CSS variables
- `@larose-ui/themes` — preset definitions including `refined`
- `@larose-ui/runtime-react` — `LaRoseProvider` with `themePreset` and `appearance`
