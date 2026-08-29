import type { SessionState } from './types';

export type SessionEvent =
  | { type: 'AUTHENTICATE' }
  | { type: 'REFRESH' }
  | { type: 'REFRESH_SUCCESS' }
  | { type: 'REFRESH_FAILED' }
  | { type: 'EXPIRE' }
  | { type: 'REVOKE' }
  | { type: 'UNAUTHORIZE' }
  | { type: 'SIGN_OUT' };

export interface SessionStateMachine {
  state: SessionState;
  send: (event: SessionEvent) => SessionState;
  reset: () => void;
}

export function createSessionStateMachine(
  initial: SessionState = 'unauthenticated',
): SessionStateMachine {
  let state: SessionState = initial;

  const machine: SessionStateMachine = {
    get state() {
      return state;
    },

    send(event: SessionEvent): SessionState {
      switch (event.type) {
        case 'AUTHENTICATE':
          state = 'authenticated';
          break;
        case 'REFRESH':
          if (state === 'authenticated' || state === 'expired') {
            state = 'refreshing';
          }
          break;
        case 'REFRESH_SUCCESS':
          state = 'authenticated';
          break;
        case 'REFRESH_FAILED':
          state = state === 'refreshing' ? 'expired' : state;
          break;
        case 'EXPIRE':
          state = 'expired';
          break;
        case 'REVOKE':
          state = 'revoked';
          break;
        case 'UNAUTHORIZE':
          state = 'unauthorized';
          break;
        case 'SIGN_OUT':
          state = 'unauthenticated';
          break;
      }
      return state;
    },

    reset() {
      state = initial;
    },
  };

  return machine;
}
