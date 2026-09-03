import { writable, derived, type Readable } from 'svelte/store';
import type { ApiError, AsyncState } from '@larose-ui/core';
import {
  apiFetch,
  createInitialMutationState,
  isApiError,
  mutationReducer,
  type ApiFetchOptions,
  type MutationState,
} from '@larose-ui/data-core';

export interface CreateMutationOptions<TData, TVariables> extends ApiFetchOptions {
  url: string;
  method?: string;
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: ApiError, variables: TVariables) => void;
}

export interface MutationController<TData, TVariables> {
  subscribe: Readable<MutationState<TData, TVariables>>['subscribe'];
  status: Readable<AsyncState>;
  data: Readable<TData | null>;
  error: Readable<ApiError | null>;
  mutate: (variables: TVariables) => Promise<TData | undefined>;
  reset: () => void;
}

export function createMutation<TData = unknown, TVariables = unknown>(
  options: CreateMutationOptions<TData, TVariables>,
): MutationController<TData, TVariables> {
  const { url, method = 'POST', onSuccess, onError, ...fetchOptions } = options;
  const store = writable(createInitialMutationState<TData, TVariables>());

  return {
    subscribe: store.subscribe,
    status: derived(store, (s) => s.status),
    data: derived(store, (s) => s.data),
    error: derived(store, (s) => s.error),
    mutate: async (variables: TVariables) => {
      store.update((s) => mutationReducer(s, { type: 'SUBMIT', variables }));
      try {
        const data = await apiFetch<TData>(url, {
          method,
          body: JSON.stringify(variables),
          ...fetchOptions,
        });
        store.update((s) => mutationReducer(s, { type: 'SUCCESS', data }));
        onSuccess?.(data, variables);
        return data;
      } catch (err) {
        const apiError = isApiError(err)
          ? err.apiError
          : { code: 500, message: 'Unknown error', retryable: true };
        store.update((s) => mutationReducer(s, { type: 'ERROR', error: apiError }));
        onError?.(apiError, variables);
        return undefined;
      }
    },
    reset: () => {
      store.update((s) => mutationReducer(s, { type: 'RESET' }));
    },
  };
}
