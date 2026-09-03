export {
  createRuntimeStore,
  defaultBreakpoints,
  buildResponsiveSnapshot,
  createTranslator,
  defaultMessages,
} from '@larose-ui/runtime-core';
export type {
  RuntimeStore,
  Breakpoint,
  BreakpointConfig,
  ResponsiveSnapshot,
  Locale,
  Messages,
  MessageKey,
  FeatureState,
} from '@larose-ui/runtime-core';

export { useBreakpoint, provideResponsive, RESPONSIVE_KEY } from './responsive/context';
export { default as ResponsiveProvider } from './responsive/ResponsiveProvider.vue';
export { default as AdaptiveTable } from './responsive/AdaptiveTable.vue';
export type { Column, AdaptiveTableProps } from './responsive/types';

export { useEnvironment, provideEnvironment, ENVIRONMENT_KEY } from './environment/context';
export { default as EnvironmentProvider } from './environment/EnvironmentProvider.vue';

export { useI18n, provideI18n, I18N_KEY, type I18nContextValue } from './i18n/context';
export { default as I18nProvider } from './i18n/I18nProvider.vue';

export { useFeature, provideFeatures, FEATURES_KEY } from './features/context';
export { default as FeatureFlagProvider } from './features/FeatureFlagProvider.vue';
export { default as Feature } from './features/Feature.vue';

export {
  useRuntimeContext,
  useOptionalRuntime,
  provideRuntime,
  createRuntimeContext,
  RUNTIME_KEY,
  type RuntimeContextValue,
} from './runtime/context';
export { default as RuntimeProvider } from './runtime/RuntimeProvider.vue';
