import { describe, it, expect } from 'vitest';
import { computeFilterRegion, filterRegionMarkupAttrs } from './filter-region';

describe('filterRegionMarkupAttrs', () => {
  it('returns element-local userSpaceOnUse bounds with padding', () => {
    const attrs = filterRegionMarkupAttrs({ width: 100, height: 50, borderRadius: 25 });
    expect(attrs.filterUnits).toBe('userSpaceOnUse');
    expect(attrs.x).toBe(-4);
    expect(attrs.y).toBe(-4);
    expect(attrs.width).toBe(108);
    expect(attrs.height).toBe(58);
  });
});

describe('computeFilterRegion', () => {
  it('includes padding in parent coordinates', () => {
    const region = computeFilterRegion(
      { width: 80, height: 32, borderRadius: 16 },
      { x: 10, y: 5 },
    );
    expect(region).toEqual({ x: 6, y: 1, width: 88, height: 40 });
  });
});
