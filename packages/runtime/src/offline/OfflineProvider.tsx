import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
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

const OfflineContext = createContext<OfflineContextValue | null>(null);

export function useOffline(): OfflineContextValue {
  const ctx = useContext(OfflineContext);
  if (!ctx) {
    throw new Error('useOffline must be used within OfflineProvider');
  }
  return ctx;
}

export interface OfflineProviderProps {
  children: ReactNode;
  queue?: OfflineQueue;
  /** Isolates offline queue storage per user/tenant — pass from LaRoseProvider. */
  scopeId?: string;
}

export function OfflineProvider({ children, queue, scopeId }: OfflineProviderProps) {
  const offlineQueue = useMemo(
    () => queue ?? createOfflineQueue(scopeId ? { scopeId } : undefined),
    [queue, scopeId],
  );
  const [requests, setRequests] = useState<QueuedRequest[]>([]);
  const [status, setStatus] = useState<OfflineSyncStatus>('idle');

  useEffect(() => {
    return offlineQueue.subscribe((q) => {
      setRequests(q);
      setStatus(offlineQueue.status);
    });
  }, [offlineQueue]);

  const sync = useCallback(
    (executor: RequestExecutor) => offlineQueue.sync(executor),
    [offlineQueue],
  );

  const value = useMemo<OfflineContextValue>(
    () => ({
      queue: requests,
      status,
      enqueue: offlineQueue.enqueue.bind(offlineQueue),
      sync,
      remove: offlineQueue.remove.bind(offlineQueue),
      clear: offlineQueue.clear.bind(offlineQueue),
    }),
    [offlineQueue, requests, status, sync],
  );

  return (
    <OfflineContext.Provider value={value}>{children}</OfflineContext.Provider>
  );
}
