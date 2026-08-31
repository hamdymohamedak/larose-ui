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
  ObservabilityProvider,
  useObservability,
  useTrackEvent,
  ObservedErrorBoundaryWithContext as ObservedErrorBoundary,
  ObservedComponent,
  ObservedForm,
  trackFormSuccess,
  trackFormError,
  trackFormValidationFailed,
  useInteractionObserver,
  useOptionalObservability,
  useJourneyPage,
  markFormSubmitted,
} from './react';
export type {
  ObservabilityContextValue,
  ObservabilityProviderProps,
  ObservedErrorBoundaryProps,
  ObservedComponentProps,
  ObservedFormProps,
} from './react';
