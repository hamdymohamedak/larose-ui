import { describe, it, expect } from 'vitest';
import {
  squircleHeightFn,
  roundedRectSDF,
  resolveLiquidGlassOptics,
  LIQUID_GLASS_OPTICS_DEFAULTS,
  supportsLiquidGlassRefraction,
} from '@larose-ui/liquid-glass-core';

describe('liquid-glass (vue adapter re-exports)', () => {
  it('squircleHeightFn is 0 at t=0 and 1 at t=1', () => {
    expect(squircleHeightFn(0)).toBe(0);
    expect(squircleHeightFn(1)).toBe(1);
  });

  it('roundedRectSDF is positive at the center of a rounded rect', () => {
    expect(roundedRectSDF(0, 0, 50, 25, 12)).toBeGreaterThan(0);
  });

  it('resolveLiquidGlassOptics merges overrides onto defaults', () => {
    const resolved = resolveLiquidGlassOptics({ blur: 20 });
    expect(resolved.blur).toBe(20);
    expect(resolved.saturation).toBe(LIQUID_GLASS_OPTICS_DEFAULTS.saturation);
  });

  it('supportsLiquidGlassRefraction returns a boolean', () => {
    expect(typeof supportsLiquidGlassRefraction()).toBe('boolean');
  });
});
