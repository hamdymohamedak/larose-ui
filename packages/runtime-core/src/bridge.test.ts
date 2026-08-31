import { describe, expect, it } from 'vitest';
import {
  buildRuntimeContextPatch,
  createNetworkTransitionEvent,
  sessionStateFromHttpCode,
} from './bridge';

describe('runtime bridge', () => {
  it('builds unified runtime context patch from domain snapshots', () => {
    const patch = buildRuntimeContextPatch({
      environment: 'staging',
      locale: 'en',
      dir: 'ltr',
      network: { condition: 'fast', online: true },
      offline: { status: 'idle', queueLength: 0 },
      permissions: ['employees.read'],
      permissionsLoading: false,
      theme: { mode: 'light', density: 'compact', tenantId: 'acme' },
      tenant: { id: 'acme', name: 'ACME' },
      user: { id: 'ahmed' },
      timezone: 'Africa/Cairo',
      features: { beta: true },
    });

    expect(patch.environment).toBe('staging');
    expect(patch.tenant?.id).toBe('acme');
    expect(patch.user?.id).toBe('ahmed');
    expect(patch.timezone).toBe('Africa/Cairo');
    expect(patch.theme?.density).toBe('compact');
    expect(patch.permissions?.granted).toEqual(['employees.read']);
    expect(patch.features?.flags.beta?.enabled).toBe(true);
  });

  it('creates network transition events only when condition changes', () => {
    expect(createNetworkTransitionEvent('fast', 'fast')).toBeNull();
    expect(createNetworkTransitionEvent('fast', 'offline')).toEqual({
      type: 'network.transition',
      metadata: { from: 'fast', to: 'offline', rtt: undefined },
    });
  });

  it('maps HTTP codes to session states', () => {
    expect(sessionStateFromHttpCode(401)).toBe('expired');
    expect(sessionStateFromHttpCode(403)).toBe('unauthorized');
    expect(sessionStateFromHttpCode(500)).toBeNull();
  });
});
