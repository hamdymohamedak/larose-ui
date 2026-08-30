import { describe, expect, it } from 'vitest';
import {
  animateSpringToTarget,
  getSpringPreset,
  isSpringSettled,
  springResponseTime,
  stepSpring,
} from './springs';
import { motionDuration, resolveReducedMotion } from './reduced';

describe('spring physics', () => {
  it('settles toward target', () => {
    const config = getSpringPreset('smooth');
    const result = animateSpringToTarget(0, 1, config);
    expect(result.value).toBeCloseTo(1, 2);
    expect(isSpringSettled(result, 1)).toBe(true);
  });

  it('preserves velocity continuity on target change', () => {
    const config = getSpringPreset('responsive');
    let state = { value: 0.5, velocity: 2 };
    state = stepSpring(state, 1, config, 1 / 60);
    expect(state.velocity).not.toBe(0);
    state = stepSpring(state, 0, config, 1 / 60);
    expect(state.velocity).toBeLessThan(2);
  });

  it('exposes sensible preset response times', () => {
    const snappy = springResponseTime(getSpringPreset('snappy'));
    const gentle = springResponseTime(getSpringPreset('gentle'));
    expect(snappy).toBeLessThan(gentle);
  });
});

describe('reduced motion', () => {
  it('respects policy', () => {
    expect(resolveReducedMotion('system', true)).toBe(true);
    expect(resolveReducedMotion('never', true)).toBe(false);
    expect(resolveReducedMotion('always', false)).toBe(true);
  });

  it('zeroes duration when reduced', () => {
    expect(motionDuration(220, true)).toBe(0);
    expect(motionDuration(220, false)).toBe(220);
  });
});
