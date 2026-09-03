import { describe, expect, it } from 'vitest';
import { createMockAdapter } from './mockAdapter';

describe('createMockAdapter', () => {
  const adapter = createMockAdapter();

  it('filters late employees', async () => {
    const data = [
      { name: 'A', lateCount: 4 },
      { name: 'B', lateCount: 1 },
    ];
    const result = await adapter.filterTable(
      'Show employees who were late more than 3 times',
      data,
      [{ key: 'lateCount', header: 'Late' }],
    );
    expect(result.data).toHaveLength(1);
    expect(result.data[0]?.name).toBe('A');
  });

  it('populates employee name from NL', async () => {
    const result = await adapter.populateForm('Create employee for Ahmed Mohamed', [
      { name: 'name', label: 'Full Name' },
      { name: 'role', label: 'Role' },
    ]);
    expect(result.values.name).toBe('Ahmed Mohamed');
  });
});
