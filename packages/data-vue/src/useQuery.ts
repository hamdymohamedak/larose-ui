import { computed, ref, shallowRef, watch, type Ref } from 'vue';
import type { ApiError } from '@larose-ui/core';
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
  /** When false, query status becomes unauthorized. */
  permissionAllowed?: boolean | Ref<boolean>;
  initialData?: T;
}

export interface UseQueryResult<T> {
  status: Ref<QueryStatus>;
  data: Ref<T | null>;
  error: Ref<ApiError | null>;
  retryCount: Ref<number>;
  isEmpty: Ref<boolean>;
  refetch: () => Promise<void>;
  retry: () => Promise<void>;
}

function resolveAllowed(value: boolean | Ref<boolean> | undefined): boolean {
  if (value === undefined) return true;
  return typeof value === 'boolean' ? value : value.value;
}

export function useQuery<T>(
  url: string | null | Ref<string | null>,
  options: UseQueryOptions<T> = {},
): UseQueryResult<T> {
  const { enabled = true, permissionAllowed, initialData, ...fetchOptions } = options;
  const state = shallowRef<QueryState<T>>(createInitialQueryState(initialData));
  const retryTick = ref(0);
  let requestId = 0;

  const resolveUrl = () => (typeof url === 'string' || url === null ? url : url.value);

  async function execute() {
    const target = resolveUrl();
    if (!target) return;
    if (!resolveAllowed(permissionAllowed)) {
      state.value = queryReducer(state.value, { type: 'UNAUTHORIZED' });
      return;
    }

    const id = ++requestId;
    state.value = queryReducer(state.value, { type: 'LOAD' });
    try {
      const data = await apiFetch<T>(target, fetchOptions);
      if (id !== requestId) return;
      state.value = queryReducer(state.value, { type: 'SUCCESS', data });
    } catch (err) {
      if (id !== requestId) return;
      if (isApiError(err)) {
        if (err.apiError.code === 401 || err.apiError.code === 403) {
          state.value = queryReducer(state.value, { type: 'UNAUTHORIZED' });
        } else {
          state.value = queryReducer(state.value, { type: 'ERROR', error: err.apiError });
        }
      } else {
        state.value = queryReducer(state.value, {
          type: 'ERROR',
          error: { code: 500, message: 'Unknown error', retryable: true },
        });
      }
    }
  }

  watch(
    () => [resolveUrl(), enabled, resolveAllowed(permissionAllowed), retryTick.value] as const,
    ([target, isEnabled]) => {
      if (isEnabled && target) void execute();
    },
    { immediate: true },
  );

  return {
    status: computed(() => state.value.status),
    data: computed(() => state.value.data),
    error: computed(() => state.value.error),
    retryCount: computed(() => state.value.retryCount),
    isEmpty: computed(() => isQueryEmpty(state.value.status, state.value.data)),
    refetch: execute,
    retry: async () => {
      state.value = queryReducer(state.value, { type: 'RETRY' });
      retryTick.value += 1;
    },
  };
}
