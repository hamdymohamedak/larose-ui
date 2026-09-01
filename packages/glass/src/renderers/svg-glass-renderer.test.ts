import { describe, it, expect } from 'vitest';
import { displacementScale } from '../renderers/svg-glass-renderer';
import { resolveLens } from '../lens/defaults';

describe('displacementScale', () => {
  it('produces sensible pixel values for default lens', () => {
    const scale = displacementScale(resolveLens({ width: 100, height: 50, borderRadius: 25 }));
    expect(scale).toBeGreaterThan(5);
    expect(scale).toBeLessThanOrEqual(52);
  });

  it('caps at 52px maximum', () => {
    const scale = displacementScale(
      resolveLens({
        width: 200,
        height: 100,
        borderRadius: 50,
        depth: 20,
        curvature: 100,
        scale: 2,
      }),
    );
    expect(scale).toBeLessThanOrEqual(52);
  });
});
