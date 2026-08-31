import { describe, expect, it } from 'vitest';
import { buildResponsiveSnapshot, resolveBreakpoint } from './breakpoints';

describe('responsive breakpoints', () => {
  it('resolves breakpoints from width', () => {
    expect(resolveBreakpoint(400)).toBe('mobile');
    expect(resolveBreakpoint(800)).toBe('tablet');
    expect(resolveBreakpoint(1100)).toBe('desktop');
    expect(resolveBreakpoint(1400)).toBe('wide');
  });

  it('builds responsive snapshot flags', () => {
    const snapshot = buildResponsiveSnapshot(800, undefined, true);
    expect(snapshot.breakpoint).toBe('tablet');
    expect(snapshot.isTablet).toBe(true);
    expect(snapshot.isDesktop).toBe(false);
    expect(snapshot.isTouch).toBe(true);
  });
});
