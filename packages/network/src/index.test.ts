import { describe, expect, it, vi } from 'vitest';
import {
  createNetworkMonitor,
  isDegradedNetwork,
  isOnlineNetwork,
  isSlowNetwork,
  normalizeNetworkCondition,
  shouldUseSkeleton,
} from './index';

describe('network helpers', () => {
  it('detects slow network conditions', () => {
    expect(isSlowNetwork('slow')).toBe(true);
    expect(isSlowNetwork('fast')).toBe(false);
    expect(isSlowNetwork('online')).toBe(false);
  });

  it('detects online network conditions including recovering', () => {
    expect(isOnlineNetwork('fast')).toBe(true);
    expect(isOnlineNetwork('online')).toBe(true);
    expect(isOnlineNetwork('recovering')).toBe(true);
    expect(isOnlineNetwork('offline')).toBe(false);
  });

  it('detects degraded networks', () => {
    expect(isDegradedNetwork('failed')).toBe(true);
    expect(isDegradedNetwork('fast')).toBe(false);
  });

  it('recommends skeleton for slow and recovering networks', () => {
    expect(shouldUseSkeleton('high-latency')).toBe(true);
    expect(shouldUseSkeleton('recovering')).toBe(true);
    expect(shouldUseSkeleton('fast')).toBe(false);
  });

  it('normalizes legacy online to fast', () => {
    expect(normalizeNetworkCondition('online')).toBe('fast');
    expect(normalizeNetworkCondition('slow')).toBe('slow');
  });
});

describe('NetworkMonitor failures', () => {
  it('transitions to failed after threshold failures', () => {
    vi.stubGlobal('navigator', { onLine: true });
    const monitor = createNetworkMonitor({ failureThreshold: 2 });
    monitor.reportFailure();
    expect(monitor.current.condition).not.toBe('failed');
    monitor.reportFailure();
    expect(monitor.current.condition).toBe('failed');
    monitor.reportSuccess();
    expect(monitor.current.failureCount).toBe(0);
    monitor.destroy();
    vi.unstubAllGlobals();
  });
});
