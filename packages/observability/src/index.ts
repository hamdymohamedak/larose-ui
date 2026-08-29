export type {
  UIEvent,
  UIEventType,
  PerformanceThreshold,
  PerformanceEvent,
  FormFunnelMetrics,
  ObservabilityAdapter,
  ObservabilityConfig,
} from './types';
export { classifyRenderTime } from './types';

export {
  EventCollector,
  createEventCollector,
  getGlobalCollector,
  setGlobalCollector,
} from './collector';

export {
  createNoopAdapter,
  createConsoleAdapter,
  createWebhookAdapter,
  createCompositeAdapter,
  createSentryAdapter,
} from './adapters';
export type { SentryAdapterOptions } from './adapters';

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
  markFormSubmitted,
} from './react';
export type {
  ObservabilityContextValue,
  ObservabilityProviderProps,
  ObservedErrorBoundaryProps,
  ObservedComponentProps,
  ObservedFormProps,
} from './react';
