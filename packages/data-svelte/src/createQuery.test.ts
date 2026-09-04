import { get } from 'svelte/store';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { createQuery } from './createQuery';

describe('createQuery (svelte)', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => vi.restoreAllMocks());
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

    const query = createQuery<{ id: string }[]>(() => '/api/items');
    await vi.waitFor(() => expect(get(query.status)).toBe('success'));
    await new Promise((r) => setTimeout(r, 30));
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(get(query.data)).toEqual([{ id: '1' }]);
  });
});
