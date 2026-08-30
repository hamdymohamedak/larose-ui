import { describe, expect, it } from 'vitest';
import { niceTicks, resolveYDomain, formatDefaultNumber } from './utils';

describe('Chart utils', () => {
  it('generates familiar tick intervals', () => {
    const ticks = niceTicks(0, 100, 5);
    expect(ticks[0]).toBe(0);
    expect(ticks).toContain(50);
    expect(ticks[ticks.length - 1]).toBeGreaterThanOrEqual(100);
  });

  it('uses zero baseline for bar charts by default', () => {
    const domain = resolveYDomain([12, 48, 30], undefined, undefined, 'bar');
    expect(domain.min).toBe(0);
  });

  it('allows dynamic range for line charts', () => {
    const domain = resolveYDomain([72, 80, 78], undefined, undefined, 'line');
    expect(domain.min).toBeLessThan(72);
  });

  it('respects fixed axis bounds', () => {
    const domain = resolveYDomain([20, 80], 0, 100, 'line');
    expect(domain).toEqual({ min: 0, max: 100 });
  });

  it('formats large numbers compactly', () => {
    expect(formatDefaultNumber(12500)).toBe('13K');
  });
});
