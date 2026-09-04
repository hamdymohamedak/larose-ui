import { computed, shallowRef, type ComputedRef } from 'vue';
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
  status: ComputedRef<AsyncState>;
  data: ComputedRef<TData | null>;
  error: ComputedRef<ApiError | null>;
  mutate: (variables: TVariables) => Promise<TData | undefined>;
  reset: () => void;
}

export function useMutation<TData = unknown, TVariables = unknown>(
  options: UseMutationOptions<TData, TVariables>,
): UseMutationResult<TData, TVariables> {
  const { url, method = 'POST', onSuccess, onError, ...fetchOptions } = options;
  const state = shallowRef(createInitialMutationState<TData, TVariables>());

  async function mutate(variables: TVariables): Promise<TData | undefined> {
    state.value = mutationReducer(state.value, { type: 'SUBMIT', variables });
    try {
      const data = await apiFetch<TData>(url, {
        method,
        body: JSON.stringify(variables),
        ...fetchOptions,
      });
      state.value = mutationReducer(state.value, { type: 'SUCCESS', data });
      onSuccess?.(data, variables);
      return data;
    } catch (err) {
      const apiError = isApiError(err)
        ? err.apiError
        : { code: 500, message: 'Unknown error', retryable: true };
      state.value = mutationReducer(state.value, { type: 'ERROR', error: apiError });
      onError?.(apiError, variables);
      return undefined;
    }
  }

  return {
    status: computed(() => state.value.status),
    data: computed(() => state.value.data),
    error: computed(() => state.value.error),
    mutate,
    reset: () => {
      state.value = mutationReducer(state.value, { type: 'RESET' });
    },
  };
}
