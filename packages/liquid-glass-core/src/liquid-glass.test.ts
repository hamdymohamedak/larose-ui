import { describe, it, expect } from 'vitest';
import { squircleHeightFn, roundedRectSDF } from './displacement-map';
import { resolveLiquidGlassOptics, LIQUID_GLASS_OPTICS_DEFAULTS } from './defaults';
import { supportsLiquidGlassRefraction } from './detect';
import { splitLiquidGlassLayoutStyle } from './splitLayoutStyle';

describe('liquid-glass-core', () => {
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

  it('splitLiquidGlassLayoutStyle moves padding to content', () => {
    const { shell, content } = splitLiquidGlassLayoutStyle({
      padding: 12,
      borderRadius: 20,
    });
    expect(content.padding).toBe(12);
    expect(shell.borderRadius).toBe(20);
    expect(shell.padding).toBeUndefined();
  });
});
