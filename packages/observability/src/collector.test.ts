import { describe, expect, it, vi } from 'vitest';
import { createEventCollector } from './collector';
import { createConsoleAdapter, createNoopAdapter } from './adapters';
import { classifyRenderTime } from './types';

describe('EventCollector', () => {
  it('tracks events and increments counters', () => {
    const adapter = createNoopAdapter();
    const track = vi.spyOn(adapter, 'track');
    const collector = createEventCollector({ adapter });

    collector.track({ type: 'form.opened', component: 'employee-create' });
    collector.track({ type: 'form.submitted', component: 'employee-create' });
    collector.track({ type: 'form.success', component: 'employee-create' });

    expect(track).toHaveBeenCalledTimes(3);
    expect(collector.getCounter('form.opened')).toBe(1);
  });

  it('computes form funnel metrics', () => {
    const collector = createEventCollector();

    collector.track({ type: 'form.opened', component: 'employee-create' });
    collector.track({ type: 'form.opened', component: 'employee-create' });
    collector.track({ type: 'form.submitted', component: 'employee-create' });
    collector.track({
      type: 'form.success',
      component: 'employee-create',
      timestamp: Date.now() + 5000,
    });
    collector.track({ type: 'form.abandoned', component: 'employee-create' });

    const metrics = collector.getFormFunnelMetrics('employee-create');
    expect(metrics.opens).toBe(2);
    expect(metrics.successes).toBe(1);
    expect(metrics.completionRate).toBe(0.5);
  });

  it('exports prometheus format', () => {
    const collector = createEventCollector();
    collector.track({ type: 'interaction', component: 'Button' });
    const output = collector.exportPrometheus();
    expect(output).toContain('larose_interaction');
  });

  it('builds journey trajectory and rage-click root causes', () => {
    const collector = createEventCollector({ tenantId: 'acme' });
    collector.setRuntimeContext({ session: 'authenticated', network: 'fast' });
    collector.trackPageView('employees');
    collector.track({
      type: 'dead_button',
      component: 'SaveButton',
      metadata: { reason: 'disabled' },
    });
    collector.track({
      type: 'rage_click',
      component: 'SaveButton',
      metadata: { clickCount: 3 },
    });

    expect(collector.getJourney().some((step) => step.kind === 'page.view')).toBe(true);
    const analyses = collector.getRageClickAnalyses();
    expect(analyses).toHaveLength(1);
    expect(analyses[0]?.likelyCauses.some((cause) => cause.type === 'dead_button')).toBe(true);
  });

  it('ingests runtime events into the journey', () => {
    const collector = createEventCollector();
    collector.ingestRuntimeEvent(
      {
        type: 'network.transition',
        timestamp: Date.now(),
        metadata: { from: 'fast', to: 'failed' },
      },
      { network: 'failed' },
    );

    expect(collector.getJourney()[0]?.kind).toBe('runtime.network');
  });
});

describe('adapters', () => {
  it('console adapter does not throw', () => {
    const adapter = createConsoleAdapter();
    expect(() =>
      adapter.track({ type: 'error', component: 'Test', timestamp: Date.now() }),
    ).not.toThrow();
  });
});

describe('classifyRenderTime', () => {
  it('classifies render thresholds', () => {
    expect(classifyRenderTime(10)).toBe('ok');
    expect(classifyRenderTime(20)).toBe('slow');
    expect(classifyRenderTime(60)).toBe('critical');
  });
});
