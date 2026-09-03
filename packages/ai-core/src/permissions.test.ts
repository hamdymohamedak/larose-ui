import { describe, expect, it } from 'vitest';
import { checkActionPermission, checkIntentPermission } from './permissions';
import { parseIntent } from './intent';

describe('checkIntentPermission', () => {
  it('allows table filter with employees.read', () => {
    const intent = parseIntent('show late employees');
    const result = checkIntentPermission(intent, ['employees.read']);
    expect(result.allowed).toBe(true);
  });

  it('denies form populate without write permission', () => {
    const intent = parseIntent('Create employee for Sara');
    const result = checkIntentPermission(intent, ['employees.read']);
    expect(result.allowed).toBe(false);
    expect(result.permission).toBe('employees.write');
  });

  it('allows action permission by context', () => {
    const result = checkActionPermission('table.filter', ['employees.read']);
    expect(result.allowed).toBe(true);
  });
});
