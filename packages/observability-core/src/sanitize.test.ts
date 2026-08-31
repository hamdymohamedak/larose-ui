import { describe, expect, it } from 'vitest';
import { sanitizeMetadata, sanitizeUIEvent } from './sanitize';

describe('sanitizeMetadata', () => {
  it('redacts sensitive keys in metadata', () => {
    const sanitized = sanitizeMetadata({
      email: 'user@example.com',
      password: 'hunter2',
      accessToken: 'secret-token',
      nested: { apiKey: 'key-123' },
    });

    expect(sanitized?.email).toBe('user@example.com');
    expect(sanitized?.password).toBe('[REDACTED]');
    expect(sanitized?.accessToken).toBe('[REDACTED]');
    expect((sanitized?.nested as Record<string, unknown>).apiKey).toBe('[REDACTED]');
  });

  it('drops prototype pollution keys', () => {
    const sanitized = sanitizeMetadata({
      __proto__: { polluted: true },
      constructor: { polluted: true },
      safe: 'ok',
    });

    expect(sanitized).toEqual({ safe: 'ok' });
    expect(Object.prototype).not.toHaveProperty('polluted');
  });
});

describe('sanitizeUIEvent', () => {
  it('sanitizes event metadata before export', () => {
    const event = sanitizeUIEvent({
      type: 'form.error',
      component: 'LoginForm',
      timestamp: 1,
      metadata: { authorization: 'Bearer abc', field: 'email' },
    });

    expect(event.metadata?.authorization).toBe('[REDACTED]');
    expect(event.metadata?.field).toBe('email');
  });
});
