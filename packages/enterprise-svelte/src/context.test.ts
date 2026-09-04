import { describe, expect, it } from 'vitest';
import { createAuditStore } from '@larose-ui/enterprise-core';

describe('enterprise-svelte', () => {
  it('uses core audit store', () => {
    const store = createAuditStore({ actor: 'ops' });
    store.recordChange({ field: 'role', before: 'a', after: 'b' });
    expect(store.getHistory('role')).toHaveLength(1);
  });
});
