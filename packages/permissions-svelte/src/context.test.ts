import { get } from 'svelte/store';
import { describe, expect, it } from 'vitest';
import { createPermissionsContext } from './context';

describe('permissions-svelte', () => {
  it('checks permissions from the context store', () => {
    const ctx = createPermissionsContext({ permissions: ['employees.read'] });
    expect(ctx.check('employees.read').allowed).toBe(true);
    expect(ctx.check('employees.write').allowed).toBe(false);
    ctx.set({ permissions: ['employees.write'] });
    expect(ctx.check('employees.write').allowed).toBe(true);
    expect(get(ctx).permissions).toEqual(['employees.write']);
  });
});
