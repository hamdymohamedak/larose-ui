export type {
  UIEvent,
  UIEventType,
  PerformanceThreshold,
  PerformanceEvent,
  FormFunnelMetrics,
  CorrelatedFormFunnelMetrics,
  JourneyStep,
  JourneyStepKind,
  JourneyContextSnapshot,
  RageClickAnalysis,
  RootCauseHint,
  RootCauseType,
  ObservabilityAdapter,
  ObservabilityConfig,
} from '@larose-ui/observability-core';
export { classifyRenderTime } from '@larose-ui/observability-core';

export {
  EventCollector,
  createEventCollector,
  getGlobalCollector,
  setGlobalCollector,
} from '@larose-ui/observability-core';

export {
  createNoopAdapter,
  createConsoleAdapter,
  createWebhookAdapter,
  createCompositeAdapter,
  createSentryAdapter,
} from '@larose-ui/observability-core';
export type { SentryAdapterOptions } from '@larose-ui/observability-core';

export { analyzeRageClick, correlateFormFunnel } from '@larose-ui/observability-core';
export {
  uiEventToJourneyStep,
  runtimeEventToJourneyStep,
  trackPageViewStep,
} from '@larose-ui/observability-core';
export { ingestRuntimeEvent, createApiRuntimeEvent } from '@larose-ui/observability-core';

export {
  OBSERVABILITY_KEY,
  createObservabilityValue,
  provideObservability,
  useObservability,
  useOptionalObservability,
  useTrackEvent,
  markFormSubmitted,
  trackFormSuccess,
  trackFormError,
  trackFormValidationFailed,
} from './context';
export type { ObservabilityContextValue } from './context';

export { useInteractionObserver, useJourneyPage } from './composables';

export { default as ObservabilityProvider } from './ObservabilityProvider.vue';
export { default as ObservedComponent } from './ObservedComponent.vue';
export { default as ObservedForm } from './ObservedForm.vue';
export { default as ObservedErrorBoundary } from './ObservedErrorBoundary.vue';
