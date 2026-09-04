import { useCallback, useEffect, useReducer, useRef } from 'react';
import type { ApiError } from '@larose-ui/core';
import { usePermissions } from '@larose-ui/permissions-react';
import {
  apiFetch,
  createInitialQueryState,
  isApiError,
  isQueryEmpty,
  queryReducer,
  type ApiFetchOptions,
  type QueryState,
  type QueryStatus,
} from '@larose-ui/data-core';

export type { QueryStatus };

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

  const [state, dispatch] = useReducer(queryReducer<T>, createInitialQueryState(initialData));

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
          error: { code: 500, message: 'Unknown error', retryable: true } satisfies ApiError,
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

  return {
    ...state,
    refetch: execute,
    retry,
    isEmpty: isQueryEmpty(state.status, state.data),
  };
}
