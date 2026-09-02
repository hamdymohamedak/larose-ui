import { describe, it, expect } from 'vitest';
import {
  resolveLiquidGlassLens,
  LIQUID_GLASS_DEFAULTS,
  isLiquidGlassEnabled,
} from './liquid-glass';

describe('liquid glass props', () => {
  it('isLiquidGlassEnabled accepts boolean and object', () => {
    expect(isLiquidGlassEnabled(true)).toBe(true);
    expect(isLiquidGlassEnabled({ depth: 12 })).toBe(true);
    expect(isLiquidGlassEnabled(false)).toBe(false);
    expect(isLiquidGlassEnabled(undefined)).toBe(false);
  });

  it('resolveLiquidGlassLens merges geometry and optical overrides', () => {
    const lens = resolveLiquidGlassLens(
      { width: 65, height: 47, borderRadius: 32 },
      {
        scale: 0.5,
        depth: 10,
        curvature: 40,
        edgeHighlight: 1,
        specularAngle: 45,
      },
    );
    expect(lens.width).toBe(65);
    expect(lens.height).toBe(47);
    expect(lens.scale).toBe(0.5);
    expect(lens.depth).toBe(10);
    expect(lens.curvature).toBe(40);
    expect(lens.edgeHighlight).toBe(1);
    expect(lens.specularAngle).toBe(45);
    expect(lens.splay).toBe(LIQUID_GLASS_DEFAULTS.splay);
  });
});
