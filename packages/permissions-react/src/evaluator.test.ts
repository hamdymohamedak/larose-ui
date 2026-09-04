import { describe, expect, it } from 'vitest';
import { hasPermission, evaluateAbac } from '@larose-ui/permissions-core';

describe('hasPermission', () => {
  it('grants exact permission', () => {
    expect(hasPermission(['employees.read'], 'employees.read').allowed).toBe(true);
  });

  it('denies missing permission', () => {
    const result = hasPermission(['employees.read'], 'employees.delete');
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain('employees.delete');
  });

  it('grants wildcard permission', () => {
    expect(hasPermission(['*'], 'anything').allowed).toBe(true);
  });

  it('grants namespace wildcard', () => {
    expect(hasPermission(['employees.*'], 'employees.delete').allowed).toBe(true);
  });

  it('denies empty or whitespace-only actions', () => {
    expect(hasPermission(['employees.read'], '').allowed).toBe(false);
    expect(hasPermission(['employees.read'], '   ').allowed).toBe(false);
    expect(hasPermission(['*'], '').allowed).toBe(false);
  });
});

describe('evaluateAbac', () => {
  it('allows admin role override', () => {
    const result = evaluateAbac([], { action: 'payroll.update' }, { roles: ['admin'] });
    expect(result.allowed).toBe(true);
  });
});
