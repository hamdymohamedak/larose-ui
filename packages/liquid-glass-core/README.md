# `@larose-ui/liquid-glass-core`

Framework-agnostic Liquid Glass optics engine — displacement maps, refraction detection, defaults, and shared types.

React, Vue, and Svelte adapters import from this package instead of maintaining three copies of the engine.

```ts
import {
  buildLiquidGlassDisplacementMap,
  resolveLiquidGlassOptics,
  supportsLiquidGlassRefraction,
  LIQUID_GLASS_PRESETS,
} from '@larose-ui/liquid-glass-core';
```
