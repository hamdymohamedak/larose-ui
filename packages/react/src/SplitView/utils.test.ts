import { describe, expect, it } from 'vitest';
import {
  clampSize,
  defaultSizesFromPanes,
  redistributeHiddenPane,
  resizeAdjacentSizes,
} from './utils';

describe('SplitView utils', () => {
  it('clamps sizes', () => {
    expect(clampSize(10, 20, 80)).toBe(20);
    expect(clampSize(100, 20, 80)).toBe(80);
  });

  it('resizes adjacent panes', () => {
    const next = resizeAdjacentSizes([40, 60], 0, 10, [20, 20], [80, 80]);
    expect(next).toEqual([50, 50]);
  });

  it('redistributes size from hidden panes', () => {
    const next = redistributeHiddenPane([25, 50, 25], 0, [false, true, true]);
    expect(next[0]).toBe(0);
    expect(next[1]! + next[2]!).toBeCloseTo(100);
  });

  it('derives default size ratios', () => {
    const sizes = defaultSizesFromPanes([
      {
        id: 'a',
        minSize: 120,
        maxSize: 800,
        defaultSize: 1,
        collapsible: false,
        defaultVisible: true,
      },
      {
        id: 'b',
        minSize: 120,
        maxSize: 800,
        defaultSize: 3,
        collapsible: false,
        defaultVisible: true,
      },
    ]);
    expect(sizes[0]).toBeCloseTo(25);
    expect(sizes[1]).toBeCloseTo(75);
  });
});
