import { describe, it, expect, beforeEach } from 'vitest';
import {
  getCachedDisplacementMap,
  clearDisplacementMapCache,
  displacementMapCacheSize,
} from '../displacement/map-cache';
import { lensesGeometryEqual } from '../lens/defaults';

const lens = {
  width: 100,
  height: 50,
  borderRadius: 25,
  depth: 8,
  curvature: 35,
};

describe('displacement map cache', () => {
  beforeEach(() => {
    clearDisplacementMapCache();
  });

  it('returns cached map for identical geometry', () => {
    const a = getCachedDisplacementMap(lens);
    const b = getCachedDisplacementMap(lens);
    expect(a).toBe(b);
    expect(displacementMapCacheSize()).toBe(1);
  });

  it('generates separate maps for different geometry', () => {
    const a = getCachedDisplacementMap(lens);
    const b = getCachedDisplacementMap({ ...lens, width: 120 });
    expect(a).not.toBe(b);
    expect(displacementMapCacheSize()).toBe(2);
  });

  it('lensesGeometryEqual detects optical param changes', () => {
    expect(lensesGeometryEqual(lens, { ...lens, depth: 12 })).toBe(false);
    expect(lensesGeometryEqual(lens, lens)).toBe(true);
  });
});
