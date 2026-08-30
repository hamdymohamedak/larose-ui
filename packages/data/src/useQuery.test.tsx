import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { PermissionProvider } from '@larose-ui/permissions';
import { useQuery } from './useQuery';

type Employee = { id: string; name: string };

function wrapper({ children }: { children: ReactNode }) {
  return (
    <PermissionProvider permissions={['employees.read']}>{children}</PermissionProvider>
  );
}

describe('useQuery', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('fetches once and does not loop after success', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => [{ id: '1', name: 'Ada' }] satisfies Employee[],
    });
    globalThis.fetch = fetchMock as typeof fetch;

    const { result } = renderHook(
      () => useQuery<Employee[]>('/api/employees', { permission: 'employees.read' }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.status).toBe('success'));

    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(fetchMock.mock.calls.length).toBe(1);
    expect(result.current.data).toEqual([{ id: '1', name: 'Ada' }]);
  });

  it('fetches once without a permission gate', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => [],
    });
    globalThis.fetch = fetchMock as typeof fetch;

    const { result } = renderHook(() => useQuery<Employee[]>('/api/employees'));

    await waitFor(() => expect(result.current.status).toBe('success'));

    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(fetchMock.mock.calls.length).toBe(1);
    expect(result.current.isEmpty).toBe(true);
  });
});
