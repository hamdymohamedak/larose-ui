import { getContext, setContext } from 'svelte';
import { writable, type Readable } from 'svelte/store';
import {
  createOfflineQueue,
  type OfflineQueue,
  type OfflineSyncStatus,
  type QueuedRequest,
  type RequestExecutor,
  type SyncResult,
} from '@larose-ui/offline';

export interface OfflineContextValue {
  queue: QueuedRequest[];
  status: OfflineSyncStatus;
  enqueue: OfflineQueue['enqueue'];
  sync: (executor: RequestExecutor) => Promise<SyncResult>;
  remove: (id: string) => boolean;
  clear: () => void;
}

export const OFFLINE_CONTEXT = 'larose-offline';

export function createOfflineStore(options?: {
  queue?: OfflineQueue;
  scopeId?: string;
}): {
  store: Readable<OfflineContextValue>;
  mount: () => void;
  destroy: () => void;
} {
  const offlineQueue =
    options?.queue ?? createOfflineQueue(options?.scopeId ? { scopeId: options.scopeId } : undefined);

  const store = writable<OfflineContextValue>({
    queue: [],
    status: 'idle',
    enqueue: offlineQueue.enqueue.bind(offlineQueue),
    sync: (executor) => offlineQueue.sync(executor),
    remove: offlineQueue.remove.bind(offlineQueue),
    clear: offlineQueue.clear.bind(offlineQueue),
  });

  let unsubscribe: (() => void) | undefined;

  return {
    store: { subscribe: store.subscribe },
    mount() {
      unsubscribe = offlineQueue.subscribe((q) => {
        store.update((prev) => ({
          ...prev,
          queue: q,
          status: offlineQueue.status,
        }));
      });
    },
    destroy() {
      unsubscribe?.();
    },
  };
}

export function setOfflineContext(store: Readable<OfflineContextValue>): void {
  setContext(OFFLINE_CONTEXT, store);
}

export function getOffline(): OfflineContextValue {
  const store = getContext<Readable<OfflineContextValue> | undefined>(OFFLINE_CONTEXT);
  if (!store) throw new Error('getOffline must be used within OfflineProvider');
  let value: OfflineContextValue | undefined;
  const unsub = store.subscribe((v) => {
    value = v;
  });
  unsub();
  return value!;
}

export function getOptionalOffline(): OfflineContextValue | null {
  try {
    const store = getContext<Readable<OfflineContextValue> | undefined>(OFFLINE_CONTEXT);
    if (!store) return null;
    let value: OfflineContextValue | null = null;
    const unsub = store.subscribe((v) => {
      value = v;
    });
    unsub();
    return value;
  } catch {
    return null;
  }
}
