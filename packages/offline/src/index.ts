export type OfflineSyncStatus =
  | 'idle'
  | 'queued'
  | 'syncing'
  | 'synced'
  | 'conflict'
  | 'failed';

export interface QueuedRequest {
  id: string;
  url: string;
  method: string;
  body?: unknown;
  headers?: Record<string, string>;
  createdAt: number;
  retries: number;
  status: OfflineSyncStatus;
  error?: string;
}

export interface SyncResult {
  synced: string[];
  failed: Array<{ id: string; error: string }>;
  conflicts: string[];
}

export type QueueListener = (queue: QueuedRequest[]) => void;
export type RequestExecutor = (request: QueuedRequest) => Promise<void>;

export interface OfflineQueueOptions {
  storageKey?: string;
  maxRetries?: number;
  persist?: boolean;
}

function generateId(): string {
  return `lr-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export class OfflineQueue {
  private queue: QueuedRequest[] = [];
  private listeners = new Set<QueueListener>();
  private readonly storageKey: string;
  private readonly maxRetries: number;
  private readonly persist: boolean;

  constructor(options: OfflineQueueOptions = {}) {
    this.storageKey = options.storageKey ?? 'larose-offline-queue';
    this.maxRetries = options.maxRetries ?? 3;
    this.persist = options.persist ?? true;
    this.load();
  }

  getAll(): QueuedRequest[] {
    return [...this.queue];
  }

  get status(): OfflineSyncStatus {
    if (this.queue.length === 0) return 'idle';
    if (this.queue.some((r) => r.status === 'syncing')) return 'syncing';
    if (this.queue.some((r) => r.status === 'conflict')) return 'conflict';
    if (this.queue.some((r) => r.status === 'failed')) return 'failed';
    if (this.queue.every((r) => r.status === 'synced')) return 'synced';
    return 'queued';
  }

  subscribe(listener: QueueListener): () => void {
    this.listeners.add(listener);
    listener(this.getAll());
    return () => this.listeners.delete(listener);
  }

  async enqueue(
    request: Omit<QueuedRequest, 'id' | 'createdAt' | 'retries' | 'status'>,
  ): Promise<string> {
    const entry: QueuedRequest = {
      ...request,
      id: generateId(),
      createdAt: Date.now(),
      retries: 0,
      status: 'queued',
    };
    this.queue.push(entry);
    this.persistQueue();
    this.notify();
    return entry.id;
  }

  remove(id: string): boolean {
    const before = this.queue.length;
    this.queue = this.queue.filter((r) => r.id !== id);
    if (this.queue.length !== before) {
      this.persistQueue();
      this.notify();
      return true;
    }
    return false;
  }

  async sync(executor: RequestExecutor): Promise<SyncResult> {
    const result: SyncResult = { synced: [], failed: [], conflicts: [] };

    for (const request of this.queue.filter(
      (r) => r.status === 'queued' || r.status === 'failed',
    )) {
      request.status = 'syncing';
      this.notify();

      try {
        await executor(request);
        request.status = 'synced';
        result.synced.push(request.id);
      } catch (err) {
        request.retries += 1;
        request.error = err instanceof Error ? err.message : String(err);

        if (request.retries >= this.maxRetries) {
          if (request.error.includes('409') || request.error.includes('conflict')) {
            request.status = 'conflict';
            result.conflicts.push(request.id);
          } else {
            request.status = 'failed';
            result.failed.push({ id: request.id, error: request.error });
          }
        } else {
          request.status = 'failed';
          result.failed.push({ id: request.id, error: request.error });
        }
      }
    }

    this.queue = this.queue.filter((r) => r.status !== 'synced');
    this.persistQueue();
    this.notify();
    return result;
  }

  clear(): void {
    this.queue = [];
    this.persistQueue();
    this.notify();
  }

  private notify(): void {
    const snapshot = this.getAll();
    this.listeners.forEach((l) => l(snapshot));
  }

  private persistQueue(): void {
    if (!this.persist || typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.queue));
    } catch {
      // Storage full or unavailable — continue in memory
    }
  }

  private load(): void {
    if (!this.persist || typeof localStorage === 'undefined') return;
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (raw) {
        this.queue = JSON.parse(raw) as QueuedRequest[];
      }
    } catch {
      this.queue = [];
    }
  }
}

export function createOfflineQueue(options?: OfflineQueueOptions): OfflineQueue {
  return new OfflineQueue(options);
}
