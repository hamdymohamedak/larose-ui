import { describe, expect, it, vi } from 'vitest';
import { createAIRuntime } from './runtime';
import { createMockAdapter } from './adapters/mockAdapter';

describe('createAIRuntime', () => {
  it('denies filter when permission missing', async () => {
    const runtime = createAIRuntime({
      adapter: createMockAdapter(),
      grantedPermissions: [],
    });

    const result = await runtime.filterTable(
      'Show employees late more than 3 times',
      [{ name: 'A', lateCount: 4 }],
      [{ key: 'lateCount', header: 'Late' }],
    );

    expect(result.allowed).toBe(false);
    expect(result.denialReason).toContain('employees.read');
  });

  it('executes filter when permitted and audits', async () => {
    const onAudit = vi.fn();
    const runtime = createAIRuntime({
      adapter: createMockAdapter(),
      grantedPermissions: ['employees.read'],
      onAudit,
    });

    const result = await runtime.filterTable(
      'Show employees who were late more than 3 times',
      [
        { name: 'A', lateCount: 4 },
        { name: 'B', lateCount: 1 },
      ],
      [{ key: 'lateCount', header: 'Late' }],
    );

    expect(result.allowed).toBe(true);
    expect(result.result?.data).toHaveLength(1);
    expect(onAudit).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'table.filter', allowed: true }),
    );
  });
});
