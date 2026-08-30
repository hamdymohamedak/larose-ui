import { useCallback, useEffect, useReducer, useRef } from 'react';
import type { ApiError } from '@larose-ui/core';
import { usePermissions } from '@larose-ui/permissions';
import { apiFetch, isApiError, type ApiFetchOptions } from './client';

export type QueryStatus = 'idle' | 'loading' | 'success' | 'error' | 'unauthorized';

export interface QueryState<T> {
  status: QueryStatus;
  data: T | null;
  error: ApiError | null;
  retryCount: number;
}

type QueryAction<T> =
  | { type: 'LOAD' }
  | { type: 'SUCCESS'; data: T }
  | { type: 'ERROR'; error: ApiError }
  | { type: 'UNAUTHORIZED' }
  | { type: 'RETRY' };

function queryReducer<T>(state: QueryState<T>, action: QueryAction<T>): QueryState<T> {
  switch (action.type) {
    case 'LOAD':
      return { ...state, status: 'loading', error: null };
    case 'SUCCESS':
      return { status: 'success', data: action.data, error: null, retryCount: state.retryCount };
    case 'ERROR':
      return { ...state, status: 'error', error: action.error };
    case 'UNAUTHORIZED':
      return { ...state, status: 'unauthorized', error: { code: 403, message: 'Unauthorized', retryable: false } };
    case 'RETRY':
      return { ...state, retryCount: state.retryCount + 1, status: 'loading' };
    default:
      return state;
  }
}

export interface UseQueryOptions<T> extends ApiFetchOptions {
  enabled?: boolean;
  permission?: string;
  resource?: string;
  initialData?: T;
}

export interface UseQueryResult<T> extends QueryState<T> {
  refetch: () => Promise<void>;
  retry: () => Promise<void>;
  isEmpty: boolean;
}

export function useQuery<T>(
  url: string | null,
  options: UseQueryOptions<T> = {},
): UseQueryResult<T> {
  const { enabled = true, permission, resource, initialData, ...fetchOptions } = options;
  const { check } = usePermissions();
  const permissionAllowed = permission ? check(permission, resource).allowed : true;

  const [state, dispatch] = useReducer(queryReducer<T>, {
    status: 'idle',
    data: initialData ?? null,
    error: null,
    retryCount: 0,
  });

  const fetchOptionsRef = useRef(fetchOptions);
  fetchOptionsRef.current = fetchOptions;

  const execute = useCallback(async () => {
    if (!url) return;
    if (!permissionAllowed) {
      dispatch({ type: 'UNAUTHORIZED' });
      return;
    }

    dispatch({ type: 'LOAD' });
    try {
      const data = await apiFetch<T>(url, fetchOptionsRef.current);
      dispatch({ type: 'SUCCESS', data });
    } catch (err) {
      if (isApiError(err)) {
        if (err.apiError.code === 401 || err.apiError.code === 403) {
          dispatch({ type: 'UNAUTHORIZED' });
        } else {
          dispatch({ type: 'ERROR', error: err.apiError });
        }
      } else {
        dispatch({
          type: 'ERROR',
          error: { code: 500, message: 'Unknown error', retryable: true },
        });
      }
    }
  }, [url, permissionAllowed]);

  useEffect(() => {
    if (enabled && url) void execute();
  }, [enabled, url, execute, state.retryCount]);

  const retry = useCallback(async () => {
    dispatch({ type: 'RETRY' });
  }, []);

  const isEmpty =
    state.status === 'success' &&
    (state.data === null ||
      state.data === undefined ||
      (Array.isArray(state.data) && state.data.length === 0));

  return {
    ...state,
    refetch: execute,
    retry,
    isEmpty,
  };
}
