import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { createHttpAdapter } from './httpAdapter';
import { createMockAdapter } from './mockAdapter';

describe('createHttpAdapter', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('falls back to mock adapter when remote fails', async () => {
    fetchMock.mockResolvedValue({ ok: false });
    const adapter = createHttpAdapter({ fallback: createMockAdapter() });

    const result = await adapter.filterTable(
      'Show employees who were late more than 3 times',
      [
        { name: 'A', lateCount: 4 },
        { name: 'B', lateCount: 1 },
      ],
      [{ key: 'lateCount', header: 'Late' }],
    );

    expect(result.data).toHaveLength(1);
  });

  it('uses remote response when available', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [{ name: 'Remote' }],
        explanation: 'From API',
      }),
    });

    const adapter = createHttpAdapter({ baseUrl: 'https://api.example.com' });
    const result = await adapter.filterTable('query', [{ name: 'Local' }], [
      { key: 'name', header: 'Name' },
    ]);

    expect(result.data[0]?.name).toBe('Remote');
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example.com/api/ai/table-filter',
      expect.objectContaining({ method: 'POST' }),
    );
  });
});
