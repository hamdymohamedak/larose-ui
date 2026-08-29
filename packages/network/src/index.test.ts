import { describe, expect, it } from 'vitest';
import { isSlowNetwork, shouldUseSkeleton } from './index';

describe('network helpers', () => {
  it('detects slow network conditions', () => {
    expect(isSlowNetwork('slow')).toBe(true);
    expect(isSlowNetwork('online')).toBe(false);
  });

  it('recommends skeleton for slow networks', () => {
    expect(shouldUseSkeleton('high-latency')).toBe(true);
    expect(shouldUseSkeleton('online')).toBe(false);
  });
});
