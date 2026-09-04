import { describe, expect, it } from 'vitest';
import { checkVersionCompatibility, createAuditStore } from '@larose-ui/enterprise-core';

describe('enterprise-vue', () => {
  it('re-exports version check', () => {
    const info = checkVersionCompatibility({ frontend: '0.2.0' });
    expect(info.compatible).toBe(true);
  });

  it('creates audit stores', () => {
    const store = createAuditStore({ actor: 'qa' });
    store.recordChange({ field: 'name', before: '', after: 'Ada', resourceId: '1' });
    expect(store.entries).toHaveLength(1);
    expect(store.actor).toBe('qa');
  });
});
