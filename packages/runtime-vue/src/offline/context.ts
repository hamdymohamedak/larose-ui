import { inject, provide, type InjectionKey, ref, type Ref } from 'vue';
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

export const OFFLINE_KEY: InjectionKey<Ref<OfflineContextValue>> = Symbol('larose-offline');

export function provideOffline(options?: {
  queue?: OfflineQueue;
  scopeId?: string;
}): {
  value: Ref<OfflineContextValue>;
  mount: () => void;
  unmount: () => void;
} {
  const offlineQueue =
    options?.queue ?? createOfflineQueue(options?.scopeId ? { scopeId: options.scopeId } : undefined);

  const value = ref<OfflineContextValue>({
    queue: [],
    status: 'idle',
    enqueue: offlineQueue.enqueue.bind(offlineQueue),
    sync: (executor) => offlineQueue.sync(executor),
    remove: offlineQueue.remove.bind(offlineQueue),
    clear: offlineQueue.clear.bind(offlineQueue),
  });

  let unsubscribe: (() => void) | undefined;

  provide(OFFLINE_KEY, value);

  return {
    value,
    mount() {
      unsubscribe = offlineQueue.subscribe((q) => {
        value.value = {
          ...value.value,
          queue: q,
          status: offlineQueue.status,
        };
      });
    },
    unmount() {
      unsubscribe?.();
    },
  };
}

export function useOffline(): OfflineContextValue {
  const ctx = inject(OFFLINE_KEY, null);
  if (!ctx) throw new Error('useOffline must be used within OfflineProvider');
  return ctx.value;
}

export function useOptionalOffline(): OfflineContextValue | null {
  return inject(OFFLINE_KEY, null)?.value ?? null;
}
