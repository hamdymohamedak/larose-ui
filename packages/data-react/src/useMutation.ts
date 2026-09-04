import { useCallback, useReducer } from 'react';
import type { ApiError, AsyncState } from '@larose-ui/core';
import {
  apiFetch,
  createInitialMutationState,
  isApiError,
  mutationReducer,
  type ApiFetchOptions,
} from '@larose-ui/data-core';

export interface UseMutationOptions<TData, TVariables> extends ApiFetchOptions {
  url: string;
  method?: string;
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: ApiError, variables: TVariables) => void;
}

export interface UseMutationResult<TData, TVariables> {
  status: AsyncState;
  data: TData | null;
  error: ApiError | null;
  mutate: (variables: TVariables) => Promise<TData | undefined>;
  reset: () => void;
}

export function useMutation<TData = unknown, TVariables = unknown>(
  options: UseMutationOptions<TData, TVariables>,
): UseMutationResult<TData, TVariables> {
  const { url, method = 'POST', onSuccess, onError, ...fetchOptions } = options;

  const [state, dispatch] = useReducer(
    mutationReducer<TData, TVariables>,
    createInitialMutationState(),
  );

  const mutate = useCallback(
    async (variables: TVariables): Promise<TData | undefined> => {
      dispatch({ type: 'SUBMIT', variables });
      try {
        const data = await apiFetch<TData>(url, {
          method,
          body: JSON.stringify(variables),
          ...fetchOptions,
        });
        dispatch({ type: 'SUCCESS', data });
        onSuccess?.(data, variables);
        return data;
      } catch (err) {
        const apiError = isApiError(err)
          ? err.apiError
          : { code: 500, message: 'Unknown error', retryable: true };
        dispatch({ type: 'ERROR', error: apiError });
        onError?.(apiError, variables);
        return undefined;
      }
    },
    [url, method, fetchOptions, onSuccess, onError],
  );

  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);

  return {
    status: state.status,
    data: state.data,
    error: state.error,
    mutate,
    reset,
  };
}
