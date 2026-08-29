import type { SessionState } from '@larose-ui/core';

const SESSION_END_STATES: SessionState[] = [
  'unauthenticated',
  'expired',
  'revoked',
  'unauthorized',
];

export function shouldClearOfflineQueueOnSession(session?: SessionState): boolean {
  return session !== undefined && SESSION_END_STATES.includes(session);
}

export function shouldSyncOfflineQueue(session?: SessionState): boolean {
  return session === undefined || session === 'authenticated' || session === 'refreshing';
}
