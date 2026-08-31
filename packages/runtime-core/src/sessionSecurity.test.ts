import { describe, expect, it } from 'vitest';
import { shouldClearOfflineQueueOnSession, shouldSyncOfflineQueue } from './sessionSecurity';

describe('sessionSecurity', () => {
  it('clears offline queue when session ends', () => {
    expect(shouldClearOfflineQueueOnSession('expired')).toBe(true);
    expect(shouldClearOfflineQueueOnSession('unauthenticated')).toBe(true);
    expect(shouldClearOfflineQueueOnSession('revoked')).toBe(true);
    expect(shouldClearOfflineQueueOnSession('unauthorized')).toBe(true);
  });

  it('does not clear offline queue for active sessions', () => {
    expect(shouldClearOfflineQueueOnSession('authenticated')).toBe(false);
    expect(shouldClearOfflineQueueOnSession('refreshing')).toBe(false);
    expect(shouldClearOfflineQueueOnSession(undefined)).toBe(false);
  });

  it('only syncs offline queue for authenticated sessions', () => {
    expect(shouldSyncOfflineQueue('authenticated')).toBe(true);
    expect(shouldSyncOfflineQueue('refreshing')).toBe(true);
    expect(shouldSyncOfflineQueue(undefined)).toBe(true);
    expect(shouldSyncOfflineQueue('expired')).toBe(false);
    expect(shouldSyncOfflineQueue('unauthenticated')).toBe(false);
  });
});
