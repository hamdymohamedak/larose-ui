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

export { analyzeRageClick, correlateFormFunnel } from './correlation';
export { uiEventToJourneyStep, runtimeEventToJourneyStep, trackPageViewStep } from './journey';
export { ingestRuntimeEvent, createApiRuntimeEvent } from './runtimeIngest';
