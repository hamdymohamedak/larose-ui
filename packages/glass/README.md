# @larose-ui/glass

Production-grade glass rendering engine for laRose UI. Refracts **live DOM content** using programmatic displacement maps — not screenshot compositing or generic `backdrop-filter: blur()` alone.

## Maturity: ~88% (v0.2)

| Area | Status |
|------|--------|
| Displacement map generator | Production-ready |
| GlassEngine + renderer abstraction | Stable |
| SVG renderer (content + backdrop) | Stable |
| WebGL renderer | Experimental |
| React components (8/8) | Stable |
| Tests | 39 tests — engine, SVG lifecycle, React, a11y |
| Documentation | This README |

## Architecture

```
Glass API (React)
       │
       ▼
 GlassEngine ─── displacement map cache
       │
   ┌───┴───┐
   │       │
  SVG     WebGL (experimental)
   │
   ├── content mode  → feDisplacementMap on SourceGraphic
   └── backdrop mode → feDisplacementMap on BackgroundImage
```

The **displacement map** is the portable primitive. Renderers are interchangeable.

## Install

```bash
pnpm add @larose-ui/glass
```

## Quick start

```tsx
import { Glass, GlassToggleGroup } from '@larose-ui/glass/react';

<Glass lens={{ width: 200, height: 72, borderRadius: 36, depth: 12, curvature: 45 }}>
  <span>Refracted content</span>
</Glass>
```

## Components

| Component | Refraction mode | Motion |
|-----------|----------------|--------|
| `Glass` | Content (SourceGraphic) | — |
| `GlassButton` / `GlassCard` | Content | — |
| `GlassPopover` / `GlassTooltip` | Content | Open/close |
| `GlassToggleGroup` | Backdrop overlay | Spring indicator |
| `GlassSwitch` | Backdrop thumb | Spring thumb |
| `GlassSlider` | Backdrop thumb | Position reuse |

## Engine API

```ts
import { GlassEngine, getCachedDisplacementMap } from '@larose-ui/glass';

const engine = new GlassEngine({
  lens: { width: 120, height: 48, borderRadius: 24 },
  refractionMode: 'backdrop', // or 'content'
});

engine.mount(element);
engine.setBounds({ x: 40, y: 0, width: 120, height: 48 }); // no map regen
engine.setLens({ ...lens, width: 140 }); // regenerates map
engine.destroy();
```

## Performance rules

| Action | Displacement map |
|--------|------------------|
| Lens move (`setPosition` / `setBounds`) | **Reuse** |
| Lens resize / optical param change (`setLens`) | **Regenerate** |
| Identical geometry (cache hit) | **Reuse from cache** |

Quadrant symmetry optimization computes ~25% of pixels, mirrors with negated R/G channels.

## Design tokens

```ts
import { lensFromTokens, LENS_PRESETS, getGlassTokens } from '@larose-ui/glass';

const lens = lensFromTokens({ width: 200, height: 72, borderRadius: 36 });
// or
const thumb = LENS_PRESETS.switchThumb(27);
```

CSS variables: `--lr-glass-depth`, `--lr-glass-curvature`, `--lr-glass-chroma`, etc.

## Browser support

| Feature | Safari | Chrome | Firefox |
|---------|--------|--------|---------|
| Content refraction (`filter: url()`) | Yes | Yes | Yes |
| Backdrop SVG displacement (`backdrop-filter: url()`) | Yes | No — CSS fallback | Limited |
| CSS glass fallback | All browsers | All browsers | All browsers |

When backdrop SVG refraction is unavailable, overlay components fall back to `backdrop-filter: blur()` + frosted material.

## Accessibility

- `prefers-reduced-motion` disables the engine and uses static glass surfaces
- Native semantics: `role="switch"`, `type="range"`, `role="tablist"`
- Toggle group supports arrow key navigation
- Decorative lens elements are `aria-hidden`

## Debug mode

```tsx
<Glass lens={lens} debug>
  ...
</Glass>
```

Shows a debug panel (renderer kind, map version, lens size, generation time) and lens bounds outline.

## Testing

```bash
pnpm --filter @larose-ui/glass test
```

## Why not glassmorphism?

Traditional glassmorphism blurs what's behind a panel. This engine **bends pixels** through a lens model using displacement maps — the approach described in [Building Glass for the Web](https://aave.com/blog/building-glass-for-the-web).

## Product integration

`TabBar` (`@larose-ui/react`) uses `useGlassLensOverlay` for the `liquidGlass` selection indicator — the same engine path as `GlassToggleGroup`.
