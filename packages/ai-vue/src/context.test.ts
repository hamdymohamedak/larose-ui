import { describe, expect, it } from 'vitest';
import { createAIRuntime, createMockAdapter, parseIntent } from '@larose-ui/ai-core';

describe('ai-vue re-exports core', () => {
  it('parses intents via core', () => {
    expect(parseIntent('filter table for late employees').type).not.toBe('unknown');
  });

  it('creates a runtime', async () => {
    const runtime = createAIRuntime({
      adapter: createMockAdapter(),
      grantedPermissions: ['employees.read'],
    });
    const result = await runtime.filterTable('show all', [{ id: '1' }], [
      { key: 'id', header: 'ID' },
    ]);
    expect(result.allowed).toBe(true);
  });
});
