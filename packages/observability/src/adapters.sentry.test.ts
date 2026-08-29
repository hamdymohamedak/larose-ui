import { describe, expect, it, vi } from 'vitest';
import { createSentryAdapter } from './adapters';
import type { UIEvent } from './types';

describe('createSentryAdapter', () => {
  it('forwards error events to Sentry', () => {
    const captureMessage = vi.fn();
    const setTag = vi.fn();
    const adapter = createSentryAdapter({
      sentry: { captureMessage, captureException: vi.fn(), setTag },
      environment: 'production',
    });

    adapter.track({
      type: 'error',
      component: 'EmployeeForm',
      timestamp: Date.now(),
      metadata: { message: 'Save failed' },
    });

    expect(setTag).toHaveBeenCalledWith('environment', 'production');
    expect(captureMessage).toHaveBeenCalledWith('Save failed', 'error');
  });

  it('no-ops when Sentry is unavailable', () => {
    const adapter = createSentryAdapter();
    expect(() =>
      adapter.track({
        type: 'interaction',
        component: 'Button',
        timestamp: Date.now(),
      } satisfies UIEvent),
    ).not.toThrow();
  });
});
