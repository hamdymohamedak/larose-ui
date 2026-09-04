import type { ApiError } from '@larose-ui/core';

export type QueryStatus = 'idle' | 'loading' | 'success' | 'error' | 'unauthorized';

export interface QueryState<T> {
  status: QueryStatus;
  data: T | null;
  error: ApiError | null;
  retryCount: number;
}

export type QueryAction<T> =
  | { type: 'LOAD' }
  | { type: 'SUCCESS'; data: T }
  | { type: 'ERROR'; error: ApiError }
  | { type: 'UNAUTHORIZED' }
  | { type: 'RETRY' };

export function queryReducer<T>(state: QueryState<T>, action: QueryAction<T>): QueryState<T> {
  switch (action.type) {
    case 'LOAD':
      return { ...state, status: 'loading', error: null };
    case 'SUCCESS':
      return { status: 'success', data: action.data, error: null, retryCount: state.retryCount };
    case 'ERROR':
      return { ...state, status: 'error', error: action.error };
    case 'UNAUTHORIZED':
      return {
        ...state,
        status: 'unauthorized',
        error: { code: 403, message: 'Unauthorized', retryable: false },
      };
    case 'RETRY':
      return { ...state, retryCount: state.retryCount + 1, status: 'loading' };
    default:
      return state;
  }
}

export function createInitialQueryState<T>(initialData?: T): QueryState<T> {
  return {
    status: 'idle',
    data: initialData ?? null,
    error: null,
    retryCount: 0,
  };
}

export function isQueryEmpty<T>(status: QueryStatus, data: T | null): boolean {
  return (
    status === 'success' &&
    (data === null || data === undefined || (Array.isArray(data) && data.length === 0))
  );
}
