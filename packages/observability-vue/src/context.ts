import { inject, provide, type InjectionKey } from 'vue';
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

export const OBSERVABILITY_KEY: InjectionKey<ObservabilityContextValue> =
  Symbol('larose-observability');

export function createObservabilityValue(
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

export function provideObservability(value: ObservabilityContextValue): void {
  provide(OBSERVABILITY_KEY, value);
}

export function useObservability(): ObservabilityContextValue {
  const ctx = inject(OBSERVABILITY_KEY, null);
  if (!ctx) {
    throw new Error('useObservability must be used within ObservabilityProvider');
  }
  return ctx;
}

export function useOptionalObservability(): ObservabilityContextValue | null {
  return inject(OBSERVABILITY_KEY, null);
}

export function useTrackEvent() {
  return useObservability().track;
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
