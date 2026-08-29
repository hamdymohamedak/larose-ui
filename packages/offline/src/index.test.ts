import { beforeEach, describe, expect, it, vi } from 'vitest';
import { buildOfflineStorageKey, createOfflineQueue } from './index';

describe('OfflineQueue', () => {
  beforeEach(() => {
    const store: Record<string, string> = {};
    vi.stubGlobal('localStorage', {
      getItem(key: string) {
        return store[key] ?? null;
      },
      setItem(key: string, value: string) {
        store[key] = value;
      },
      removeItem(key: string) {
        delete store[key];
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

  it('isolates persisted queues by scopeId', async () => {
    const queueA = createOfflineQueue({ scopeId: 'tenant-1:user-a', persist: true });
    const queueB = createOfflineQueue({ scopeId: 'tenant-1:user-b', persist: true });

    await queueA.enqueue({ url: '/api/user-a', method: 'POST', body: { owner: 'a' } });
    expect(queueB.getAll()).toHaveLength(0);

    await queueB.enqueue({ url: '/api/user-b', method: 'POST', body: { owner: 'b' } });
    expect(queueA.getAll()).toHaveLength(1);
    expect(queueB.getAll()).toHaveLength(1);
    expect(queueA.getAll()[0]?.url).toBe('/api/user-a');
    expect(queueB.getAll()[0]?.url).toBe('/api/user-b');
  });

  it('does not replay another user queue after scope switch', async () => {
    let scope = 'tenant-1:user-a';
    let queue = createOfflineQueue({ scopeId: scope, persist: true });
    await queue.enqueue({ url: '/api/delete-all', method: 'DELETE' });

    scope = 'tenant-1:user-b';
    queue = createOfflineQueue({ scopeId: scope, persist: true });
    expect(queue.getAll()).toHaveLength(0);
  });

  it('ignores malformed persisted queue payloads', () => {
    localStorage.setItem(
      buildOfflineStorageKey('bad-data'),
      JSON.stringify([{ id: 1, url: '/api/x' }, { not: 'valid' }]),
    );
    const queue = createOfflineQueue({ scopeId: 'bad-data', persist: true });
    expect(queue.getAll()).toHaveLength(0);
  });

  it('ignores prototype pollution keys in stored JSON', () => {
    localStorage.setItem(
      buildOfflineStorageKey('proto-test'),
      '{"__proto__":{"polluted":true}}',
    );
    const queue = createOfflineQueue({ scopeId: 'proto-test', persist: true });
    expect(queue.getAll()).toHaveLength(0);
    expect(Object.prototype).not.toHaveProperty('polluted');
  });
});
