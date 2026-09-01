import { describe, it, expect } from 'vitest';
import { computeFloatingPlacement } from './useFloatingPlacement';

const anchor = {
  left: 100,
  top: 200,
  right: 180,
  bottom: 240,
  width: 80,
  height: 40,
} as DOMRectReadOnly;

describe('computeFloatingPlacement', () => {
  it('places panel below anchor in fixed strategy using viewport coords', () => {
    const result = computeFloatingPlacement(anchor, 200, 120, {
      gap: 8,
      padding: 8,
      preferredSide: 'bottom',
      strategy: 'fixed',
    });
    expect(result.strategy).toBe('fixed');
    expect(result.side).toBe('bottom');
    expect(result.top).toBe(248);
    expect(result.left).toBe(100);
  });

  it('flips above when insufficient space below', () => {
    const nearBottom = {
      ...anchor,
      top: window.innerHeight - 60,
      bottom: window.innerHeight - 20,
    } as DOMRectReadOnly;

    const result = computeFloatingPlacement(nearBottom, 200, 120, {
      gap: 8,
      padding: 8,
      preferredSide: 'bottom',
      strategy: 'fixed',
    });
    expect(result.side).toBe('top');
    expect(result.top).toBeLessThan(nearBottom.top);
  });

  it('shifts left when panel would overflow viewport right edge', () => {
    const nearRight = {
      ...anchor,
      left: window.innerWidth - 40,
      right: window.innerWidth,
    } as DOMRectReadOnly;

    const result = computeFloatingPlacement(nearRight, 200, 40, {
      gap: 8,
      padding: 8,
      preferredSide: 'bottom',
      strategy: 'fixed',
    });
    expect(result.left).toBeLessThanOrEqual(window.innerWidth - 8 - 200);
  });
});
