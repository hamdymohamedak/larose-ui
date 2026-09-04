import { describe, expect, it } from 'vitest';
import { isSafeRedirectPath } from '@larose-ui/core';

describe('SessionGuard redirect safety', () => {
  it('rejects external login URLs', () => {
    expect(isSafeRedirectPath('https://evil.example/login')).toBe(false);
    expect(isSafeRedirectPath('//evil.example/login')).toBe(false);
    expect(isSafeRedirectPath('javascript:alert(1)')).toBe(false);
  });

  it('allows same-origin login paths', () => {
    expect(isSafeRedirectPath('/login')).toBe(true);
    expect(isSafeRedirectPath('/auth/sign-in')).toBe(true);
  });
});
