import { describe, expect, it } from 'vitest';
import { isSafeRedirectPath, sanitizeNavigationUrl } from './url';

describe('sanitizeNavigationUrl', () => {
  it('allows safe relative paths', () => {
    expect(sanitizeNavigationUrl('/employees')).toBe('/employees');
    expect(sanitizeNavigationUrl('#section')).toBe('#section');
  });

  it('blocks javascript and data URLs', () => {
    expect(sanitizeNavigationUrl('javascript:alert(1)')).toBeUndefined();
    expect(sanitizeNavigationUrl('data:text/html,<script>alert(1)</script>')).toBeUndefined();
    expect(sanitizeNavigationUrl('  javascript:alert(1)')).toBeUndefined();
  });

  it('blocks protocol-relative URLs', () => {
    expect(sanitizeNavigationUrl('//evil.example/phish')).toBeUndefined();
  });

  it('blocks backslash-normalized javascript URLs', () => {
    expect(sanitizeNavigationUrl(String.raw`javascript:alert(1)`)).toBeUndefined();
  });
});

describe('isSafeRedirectPath', () => {
  it('allows in-app paths', () => {
    expect(isSafeRedirectPath('/login')).toBe(true);
    expect(isSafeRedirectPath('/auth/callback?next=/app')).toBe(true);
  });

  it('rejects external and dangerous redirects', () => {
    expect(isSafeRedirectPath('https://evil.example')).toBe(false);
    expect(isSafeRedirectPath('//evil.example')).toBe(false);
    expect(isSafeRedirectPath('javascript:alert(1)')).toBe(false);
  });
});
