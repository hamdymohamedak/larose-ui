import { effectScope, nextTick } from 'vue';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { useQuery } from './useQuery';

describe('useQuery (vue)', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('fetches once and settles on success', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => [{ id: '1' }],
    });
    globalThis.fetch = fetchMock as typeof fetch;

    const scope = effectScope();
    const query = scope.run(() => useQuery<{ id: string }[]>('/api/items', { enabled: false }))!;

    await query.refetch();
    await nextTick();

    expect(query.status.value).toBe('success');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(query.data.value).toEqual([{ id: '1' }]);
    scope.stop();
  });
});
