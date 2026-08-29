import { useCallback, useReducer } from 'react';
import type { ApiError, AsyncState } from '@larose-ui/core';
import { apiFetch, isApiError, type ApiFetchOptions } from './client';

export interface MutationState<TData, TVariables> {
  status: AsyncState;
  data: TData | null;
  error: ApiError | null;
  variables: TVariables | null;
}

type MutationAction<TData, TVariables> =
  | { type: 'SUBMIT'; variables: TVariables }
  | { type: 'SUCCESS'; data: TData }
  | { type: 'ERROR'; error: ApiError }
  | { type: 'RESET' };

function mutationReducer<TData, TVariables>(
  state: MutationState<TData, TVariables>,
  action: MutationAction<TData, TVariables>,
): MutationState<TData, TVariables> {
  switch (action.type) {
    case 'SUBMIT':
      return { ...state, status: 'submitting', error: null, variables: action.variables };
    case 'SUCCESS':
      return { status: 'success', data: action.data, error: null, variables: state.variables };
    case 'ERROR':
      return { ...state, status: 'error', error: action.error };
    case 'RESET':
      return { status: 'idle', data: null, error: null, variables: null };
    default:
      return state;
  }
}

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

  const [state, dispatch] = useReducer(mutationReducer<TData, TVariables>, {
    status: 'idle',
    data: null,
    error: null,
    variables: null,
  });

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
