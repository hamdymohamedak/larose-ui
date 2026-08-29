import { describe, expect, it } from 'vitest';
import { analyzeRageClick, correlateFormFunnel } from './correlation';
import type { FormFunnelMetrics, JourneyStep, UIEvent } from './types';

describe('analyzeRageClick', () => {
  it('links rage clicks to recent errors and network failures', () => {
    const rage: UIEvent = {
      type: 'rage_click',
      component: 'SaveButton',
      timestamp: 10_000,
      metadata: { clickCount: 4 },
    };

    const events: UIEvent[] = [
      {
        type: 'dead_button',
        component: 'SaveButton',
        timestamp: 9_900,
        metadata: { reason: 'disabled while saving' },
      },
      {
        type: 'performance',
        component: 'SaveButton',
        timestamp: 9_950,
        metadata: { renderTimeMs: 55, threshold: 'critical' },
      },
    ];

    const journey: JourneyStep[] = [
      {
        id: 'j1',
        kind: 'runtime.network',
        timestamp: 9_800,
        label: 'Network fast → failed',
        metadata: { to: 'failed' },
      },
    ];

    const analysis = analyzeRageClick(rage, events, journey);
    expect(analysis.likelyCauses.length).toBeGreaterThan(0);
    expect(analysis.likelyCauses.some((cause) => cause.type === 'dead_button')).toBe(true);
    expect(analysis.likelyCauses.some((cause) => cause.type === 'network')).toBe(true);
  });
});

describe('correlateFormFunnel', () => {
  it('adds drop-off signals from correlated events', () => {
    const metrics: FormFunnelMetrics = {
      form: 'employee-create',
      opens: 1,
      submissions: 0,
      successes: 0,
      errors: 0,
      abandonments: 1,
      validationFailures: 1,
      openRate: 1,
      completionRate: 0,
      errorRate: 0,
      abandonmentRate: 1,
      avgCompletionTimeMs: null,
    };

    const events: UIEvent[] = [
      {
        type: 'form.opened',
        component: 'employee-create',
        timestamp: 1000,
      },
      {
        type: 'form.validation_failed',
        component: 'employee-create',
        timestamp: 1500,
        metadata: { fields: ['email'] },
      },
      {
        type: 'form.abandoned',
        component: 'employee-create',
        timestamp: 2000,
      },
    ];

    const correlated = correlateFormFunnel('employee-create', metrics, events, []);
    expect(correlated.dropOffSignals).toContain('validation_failures');
  });
});
