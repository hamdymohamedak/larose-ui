import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createOfflineQueue } from './index';

describe('OfflineQueue', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      store: {} as Record<string, string>,
      getItem(key: string) {
        return this.store[key] ?? null;
      },
      setItem(key: string, value: string) {
        this.store[key] = value;
      },
      removeItem(key: string) {
        delete this.store[key];
      },
    });
  });

  it('enqueues requests', async () => {
    const queue = createOfflineQueue({ persist: false });
    const id = await queue.enqueue({
      url: '/api/employees',
      method: 'POST',
      body: { name: 'Ahmed' },
    });
    expect(queue.getAll()).toHaveLength(1);
    expect(queue.getAll()[0]?.id).toBe(id);
    expect(queue.status).toBe('queued');
  });

  it('syncs queued requests', async () => {
    const queue = createOfflineQueue({ persist: false });
    await queue.enqueue({ url: '/api/test', method: 'POST' });

    const result = await queue.sync(async () => {
      // success
    });

    expect(result.synced).toHaveLength(1);
    expect(queue.getAll()).toHaveLength(0);
  });

  it('handles sync failures with retry tracking', async () => {
    const queue = createOfflineQueue({ persist: false, maxRetries: 1 });
    await queue.enqueue({ url: '/api/test', method: 'POST' });

    const result = await queue.sync(async () => {
      throw new Error('Network error');
    });

    expect(result.failed).toHaveLength(1);
    expect(queue.getAll()[0]?.status).toBe('failed');
  });

  it('detects conflicts', async () => {
    const queue = createOfflineQueue({ persist: false, maxRetries: 1 });
    await queue.enqueue({ url: '/api/test', method: 'PUT' });

    const result = await queue.sync(async () => {
      throw new Error('409 conflict detected');
    });

    expect(result.conflicts).toHaveLength(1);
    expect(queue.status).toBe('conflict');
  });
});
