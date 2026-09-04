import { describe, expect, it, vi } from 'vitest';
import {
  createEventCollector,
  createNoopAdapter,
} from '@larose-ui/observability-core';
import {
  createObservabilityContext,
  createInteractionObserver,
  markFormSubmitted,
  syncObservabilityScope,
} from './context';

describe('observability-svelte context', () => {
  it('tracks events through the context value', () => {
    const collector = createEventCollector();
    const ctx = createObservabilityContext({ collector });
    ctx.track({ type: 'form.opened', component: 'signup' });
    expect(collector.getFormFunnelMetrics('signup').opens).toBe(1);
  });

  it('resets collector when tenant scope changes', () => {
    const collector = createEventCollector({ tenantId: 'tenant-a', userId: 'user-a' });
    const ctx = createObservabilityContext({ collector });
    ctx.track({ type: 'interaction', component: 'btn' });
    expect(collector.getEvents()).toHaveLength(1);

    const scopeRef = { current: 'tenant-a:user-a:' };
    syncObservabilityScope(
      ctx,
      { tenantId: 'tenant-b', userId: 'user-a' },
      scopeRef,
    );
    expect(collector.getEvents()).toHaveLength(0);
  });

  it('uses adapter when tracking', () => {
    const adapter = createNoopAdapter();
    const track = vi.spyOn(adapter, 'track');
    const collector = createEventCollector({ adapter });
    const ctx = createObservabilityContext({ collector });
    ctx.track({ type: 'interaction', component: 'btn' });
    expect(track).toHaveBeenCalled();
  });

  it('createInteractionObserver detects rage clicks', () => {
    const collector = createEventCollector();
    const ctx = createObservabilityContext({ collector });
    const observer = createInteractionObserver('btn', ctx.track);
    const target = document.createElement('button');
    const event = new MouseEvent('click', { bubbles: true });
    Object.defineProperty(event, 'target', { value: target });

    observer.onClick(event);
    observer.onClick(event);
    observer.onClick(event);

    expect(collector.getEvents({ type: 'interaction' })).toHaveLength(3);
    expect(collector.getEvents({ type: 'rage_click' })).toHaveLength(1);
  });

  it('markFormSubmitted records submitted event', () => {
    const collector = createEventCollector();
    const ctx = createObservabilityContext({ collector });
    markFormSubmitted('signup', ctx.track);
    expect(collector.getEvents({ type: 'form.submitted' })).toHaveLength(1);
  });
});
