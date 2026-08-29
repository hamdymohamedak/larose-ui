import { describe, expect, it, vi } from 'vitest';
import {
  createDefaultRuntimeContext,
  createRuntimeEventBus,
  createSessionStateMachine,
  createStaticFeatureFlagEvaluator,
  createPercentageRolloutEvaluator,
  detectA11yPreferences,
} from '../index';

describe('createDefaultRuntimeContext', () => {
  it('returns a complete snapshot with defaults', () => {
    const ctx = createDefaultRuntimeContext();
    expect(ctx.environment).toBe('development');
    expect(ctx.session).toBe('unauthenticated');
    expect(ctx.theme.density).toBe('comfortable');
  });

  it('merges overrides', () => {
    const ctx = createDefaultRuntimeContext({
      environment: 'production',
      session: 'authenticated',
    });
    expect(ctx.environment).toBe('production');
    expect(ctx.session).toBe('authenticated');
  });
});

describe('createRuntimeEventBus', () => {
  it('emits events with timestamps and maintains timeline', () => {
    const bus = createRuntimeEventBus({ maxEvents: 10 });
    const event = bus.emit({ type: 'runtime.mounted' });
    expect(event.timestamp).toBeTypeOf('number');
    expect(bus.getTimeline()).toHaveLength(1);
  });

  it('notifies subscribers', () => {
    const bus = createRuntimeEventBus();
    const listener = vi.fn();
    bus.subscribe(listener);
    bus.emit({ type: 'network.transition', metadata: { to: 'slow' } });
    expect(listener).toHaveBeenCalledOnce();
  });

  it('trims timeline to maxEvents', () => {
    const bus = createRuntimeEventBus({ maxEvents: 2 });
    bus.emit({ type: 'runtime.mounted' });
    bus.emit({ type: 'runtime.updated' });
    bus.emit({ type: 'runtime.updated' });
    expect(bus.getTimeline()).toHaveLength(2);
  });
});

describe('createSessionStateMachine', () => {
  it('transitions unauthenticated → authenticated', () => {
    const machine = createSessionStateMachine();
    machine.send({ type: 'AUTHENTICATE' });
    expect(machine.state).toBe('authenticated');
  });

  it('transitions authenticated → refreshing → authenticated', () => {
    const machine = createSessionStateMachine('authenticated');
    machine.send({ type: 'REFRESH' });
    expect(machine.state).toBe('refreshing');
    machine.send({ type: 'REFRESH_SUCCESS' });
    expect(machine.state).toBe('authenticated');
  });

  it('handles session expiry', () => {
    const machine = createSessionStateMachine('authenticated');
    machine.send({ type: 'EXPIRE' });
    expect(machine.state).toBe('expired');
  });
});

describe('feature flag evaluators', () => {
  it('evaluates static flags', () => {
    const evaluator = createStaticFeatureFlagEvaluator({ payroll: true, hr: false });
    expect(evaluator.evaluate('payroll', {}).enabled).toBe(true);
    expect(evaluator.evaluate('hr', {}).enabled).toBe(false);
  });

  it('applies percentage rollout consistently', () => {
    const evaluator = createPercentageRolloutEvaluator({
      beta: { enabled: true, percentage: 50 },
    });
    const a = evaluator.evaluate('beta', { userId: 'user-a', tenantId: 'acme' });
    const b = evaluator.evaluate('beta', { userId: 'user-a', tenantId: 'acme' });
    expect(a.enabled).toBe(b.enabled);
  });
});

describe('detectA11yPreferences', () => {
  it('returns booleans', () => {
    const prefs = detectA11yPreferences();
    expect(typeof prefs.reducedMotion).toBe('boolean');
    expect(typeof prefs.highContrast).toBe('boolean');
  });
});
