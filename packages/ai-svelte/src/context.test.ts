import { describe, expect, it } from 'vitest';
import { createAIRuntime, createMockAdapter } from '@larose-ui/ai-core';

describe('ai-svelte', () => {
  it('creates runtime from core', async () => {
    const runtime = createAIRuntime({
      adapter: createMockAdapter(),
      grantedPermissions: ['employees.write'],
    });
    const result = await runtime.populateForm('create employee', [
      { name: 'name', label: 'Name' },
    ]);
    expect(result.allowed).toBe(true);
  });
});
