import { writable, derived, type Readable } from 'svelte/store';
import {
  apiFetch,
  createInitialQueryState,
  isApiError,
  isQueryEmpty,
  queryReducer,
  type ApiFetchOptions,
  type QueryState,
} from '@larose-ui/data-core';

export interface CreateQueryOptions<T> extends ApiFetchOptions {
  enabled?: boolean;
  permissionAllowed?: boolean | (() => boolean);
  initialData?: T;
}

export interface QueryController<T> {
  subscribe: Readable<QueryState<T>>['subscribe'];
  status: Readable<QueryState<T>['status']>;
  data: Readable<T | null>;
  error: Readable<QueryState<T>['error']>;
  isEmpty: Readable<boolean>;
  refetch: () => Promise<void>;
  retry: () => Promise<void>;
}

function resolveAllowed(value: boolean | (() => boolean) | undefined): boolean {
  if (value === undefined) return true;
  return typeof value === 'function' ? value() : value;
}

export function createQuery<T>(
  getUrl: () => string | null,
  options: CreateQueryOptions<T> = {},
): QueryController<T> {
  const { enabled = true, permissionAllowed, initialData, ...fetchOptions } = options;
  const store = writable<QueryState<T>>(createInitialQueryState(initialData));

  async function execute() {
    const url = getUrl();
    if (!url) return;
    if (!resolveAllowed(permissionAllowed)) {
      store.update((s) => queryReducer(s, { type: 'UNAUTHORIZED' }));
      return;
    }
    store.update((s) => queryReducer(s, { type: 'LOAD' }));
    try {
      const data = await apiFetch<T>(url, fetchOptions);
      store.update((s) => queryReducer(s, { type: 'SUCCESS', data }));
    } catch (err) {
      if (isApiError(err)) {
        if (err.apiError.code === 401 || err.apiError.code === 403) {
          store.update((s) => queryReducer(s, { type: 'UNAUTHORIZED' }));
        } else {
          store.update((s) => queryReducer(s, { type: 'ERROR', error: err.apiError }));
        }
      } else {
        store.update((s) =>
          queryReducer(s, {
            type: 'ERROR',
            error: { code: 500, message: 'Unknown error', retryable: true },
          }),
        );
      }
    }
  }

  if (enabled && getUrl()) void execute();

  return {
    subscribe: store.subscribe,
    status: derived(store, (s) => s.status),
    data: derived(store, (s) => s.data),
    error: derived(store, (s) => s.error),
    isEmpty: derived(store, (s) => isQueryEmpty(s.status, s.data)),
    refetch: execute,
    retry: async () => {
      store.update((s) => queryReducer(s, { type: 'RETRY' }));
      await execute();
    },
  };
}
