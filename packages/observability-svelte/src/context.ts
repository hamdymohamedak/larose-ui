import { getContext, setContext } from 'svelte';
import {
  createEventCollector,
  type EventCollector,
  type FormFunnelMetrics,
  type CorrelatedFormFunnelMetrics,
  type JourneyStep,
  type RageClickAnalysis,
  type UIEvent,
  type ObservabilityAdapter,
  type ObservabilityConfig,
} from '@larose-ui/observability-core';

export const OBSERVABILITY_CONTEXT = 'larose-observability';

export interface ObservabilityContextValue {
  collector: EventCollector;
  track: (event: Omit<UIEvent, 'timestamp'> & { timestamp?: number }) => UIEvent;
  getFormFunnelMetrics: (formName: string) => FormFunnelMetrics;
  getCorrelatedFormFunnel: (formName: string) => CorrelatedFormFunnelMetrics;
  getJourney: (limit?: number) => JourneyStep[];
  getRageClickAnalyses: () => RageClickAnalysis[];
  trackPageView: (pageName: string) => JourneyStep;
  exportMetrics: () => { counters: Record<string, number>; forms: Record<string, FormFunnelMetrics> };
  exportPrometheus: () => string;
}

export function createObservabilityContext(
  config: ObservabilityConfig & { collector?: EventCollector } = {},
): ObservabilityContextValue {
  const collector =
    config.collector ??
    createEventCollector({
      adapter: config.adapter,
      tenantId: config.tenantId,
      userId: config.userId,
      sessionId: config.sessionId,
      debug: config.debug,
    });

  return {
    collector,
    track: (event) => collector.track(event),
    getFormFunnelMetrics: (formName) => collector.getFormFunnelMetrics(formName),
    getCorrelatedFormFunnel: (formName) => collector.getCorrelatedFormFunnel(formName),
    getJourney: (limit) => collector.getJourney(limit),
    getRageClickAnalyses: () => collector.getRageClickAnalyses(),
    trackPageView: (pageName) => collector.trackPageView(pageName),
    exportMetrics: () => collector.exportMetrics(),
    exportPrometheus: () => collector.exportPrometheus(),
  };
}

export function setObservabilityContext(value: ObservabilityContextValue): void {
  setContext(OBSERVABILITY_CONTEXT, value);
}

export function getObservabilityContext(): ObservabilityContextValue {
  const ctx = getContext<ObservabilityContextValue | undefined>(OBSERVABILITY_CONTEXT);
  if (!ctx) {
    throw new Error('getObservabilityContext must be used within ObservabilityProvider');
  }
  return ctx;
}

export function getOptionalObservabilityContext(): ObservabilityContextValue | null {
  return getContext<ObservabilityContextValue | undefined>(OBSERVABILITY_CONTEXT) ?? null;
}

export function syncObservabilityScope(
  value: ObservabilityContextValue,
  scope: { adapter?: ObservabilityAdapter; tenantId?: string; userId?: string; sessionId?: string },
  previousScope: { current: string },
): void {
  if (scope.adapter) {
    value.collector.setAdapter(scope.adapter);
  }
  const next = `${scope.tenantId ?? ''}:${scope.userId ?? ''}:${scope.sessionId ?? ''}`;
  if (previousScope.current !== next) {
    value.collector.reset();
    previousScope.current = next;
  }
}

export function markFormSubmitted(
  name: string,
  track: ObservabilityContextValue['track'],
): void {
  track({ type: 'form.submitted', component: name });
}

export function trackFormSuccess(
  name: string,
  track: ObservabilityContextValue['track'],
): void {
  track({ type: 'form.success', component: name });
}

export function trackFormError(
  name: string,
  track: ObservabilityContextValue['track'],
  error?: string,
): void {
  track({ type: 'form.error', component: name, metadata: { error } });
}

export function trackFormValidationFailed(
  name: string,
  track: ObservabilityContextValue['track'],
  fields: string[],
): void {
  track({
    type: 'form.validation_failed',
    component: name,
    metadata: { fields },
  });
}

export function createInteractionObserver(
  component: string,
  track: ObservabilityContextValue['track'],
) {
  let clicks: number[] = [];

  function onClick(e: MouseEvent, metadata?: Record<string, unknown>) {
    const now = Date.now();
    clicks = clicks.filter((t) => now - t < 1000);
    clicks.push(now);

    track({
      type: 'interaction',
      component,
      metadata: { target: (e.target as HTMLElement).tagName, ...metadata },
    });

    if (clicks.length >= 3) {
      track({
        type: 'rage_click',
        component,
        metadata: { clickCount: clicks.length },
      });
      clicks = [];
    }
  }

  function trackDeadButton(reason: string) {
    track({ type: 'dead_button', component, metadata: { reason } });
  }

  function trackRetry(metadata?: Record<string, unknown>) {
    track({ type: 'retry', component, metadata });
  }

  function trackRetrySuccess() {
    track({ type: 'retry.success', component });
  }

  return { onClick, trackDeadButton, trackRetry, trackRetrySuccess };
}
