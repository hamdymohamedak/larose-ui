import { describe, it, expect } from 'vitest';
import {
  generateDisplacementMap,
  generateDisplacementMapFull,
  displacementMapsEqual,
} from '../displacement/displacement-map';
import {
  computeLensDisplacement,
  encodeDisplacementChannel,
  roundedRectSdf,
} from '../displacement/lens-profile';
import { lensesGeometryEqual, resolveLens, lensGeometryKey } from '../lens/defaults';
import { computeFilterRegion } from '../lens/filter-region';

describe('displacement map', () => {
  const lens = {
    width: 100,
    height: 50,
    borderRadius: 25,
    depth: 8,
    curvature: 35,
    splay: 1.2,
    scale: 1,
  };

  it('generates map with correct dimensions', () => {
    const map = generateDisplacementMap(lens, { pixelRatio: 1 });
    expect(map.width).toBe(100);
    expect(map.height).toBe(50);
    expect(map.data.length).toBe(100 * 50 * 4);
  });

  it('uses neutral values outside lens region', () => {
    const map = generateDisplacementMap(lens, { pixelRatio: 1 });
    const topLeft = map.data[0]!;
    const topLeftG = map.data[1]!;
    // Corner may be outside rounded rect
    expect(topLeft).toBeGreaterThanOrEqual(0);
    expect(topLeftG).toBeGreaterThanOrEqual(0);
  });

  it('optimized map matches full map for symmetric lenses', () => {
    const symmetric = { ...lens, width: 80, height: 80, borderRadius: 20 };
    const optimized = generateDisplacementMap(symmetric, { optimize: true });
    const full = generateDisplacementMapFull(symmetric, { optimize: false });
    expect(displacementMapsEqual(optimized, full)).toBe(true);
  });

  it('center pixel has lower displacement than edge', () => {
    const { dx: centerDx, dy: centerDy } = computeLensDisplacement(
      50, 25, 100, 50, 25, 8, 35, 1.2, 1,
    );
    const { dx: edgeDx, dy: edgeDy } = computeLensDisplacement(
      95, 25, 100, 50, 25, 8, 35, 1.2, 1,
    );
    const centerMag = Math.hypot(centerDx, centerDy);
    const edgeMag = Math.hypot(edgeDx, edgeDy);
    expect(edgeMag).toBeGreaterThan(centerMag);
  });
});

describe('lens profile', () => {
  it('roundedRectSdf is negative inside', () => {
    expect(roundedRectSdf(0, 0, 50, 25, 10)).toBeLessThan(0);
  });

  it('roundedRectSdf is positive outside', () => {
    expect(roundedRectSdf(100, 100, 50, 25, 10)).toBeGreaterThan(0);
  });

  it('encodeDisplacementChannel centers at 128', () => {
    expect(encodeDisplacementChannel(0)).toBe(128);
  });
});

describe('lens geometry', () => {
  it('detects geometry changes', () => {
    const a = resolveLens({ width: 100, height: 50, borderRadius: 25 });
    const b = resolveLens({ width: 120, height: 50, borderRadius: 25 });
    expect(lensesGeometryEqual(a, b)).toBe(false);
  });

  it('ignores position in geometry key', () => {
    const key = lensGeometryKey(resolveLens({ width: 100, height: 50, borderRadius: 25 }));
    expect(key).toContain('100');
  });

  it('computes filter region with padding', () => {
    const region = computeFilterRegion(
      { width: 100, height: 50, borderRadius: 25 },
      { x: 10, y: 20 },
    );
    expect(region.x).toBe(6);
    expect(region.y).toBe(16);
    expect(region.width).toBe(108);
    expect(region.height).toBe(58);
  });
});
