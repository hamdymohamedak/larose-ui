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

export {
  createResponsiveStore,
  setResponsiveContext,
  getBreakpoint,
  RESPONSIVE_CONTEXT,
} from './responsive/context';
export { default as ResponsiveProvider } from './responsive/ResponsiveProvider.svelte';
export { default as AdaptiveTable } from './responsive/AdaptiveTable.svelte';
export type { Column, AdaptiveTableProps } from './responsive/types';

export { setEnvironmentContext, getEnvironment, ENVIRONMENT_CONTEXT } from './environment/context';
export { default as EnvironmentProvider } from './environment/EnvironmentProvider.svelte';

export {
  createI18nValue,
  setI18nContext,
  getI18n,
  I18N_CONTEXT,
  type I18nContextValue,
} from './i18n/context';
export { default as I18nProvider } from './i18n/I18nProvider.svelte';

export {
  createFeatureContext,
  setFeaturesContext,
  getFeature,
  FEATURES_CONTEXT,
} from './features/context';
export { default as FeatureFlagProvider } from './features/FeatureFlagProvider.svelte';
export { default as Feature } from './features/Feature.svelte';

export {
  createRuntimeContext,
  setRuntimeContext,
  getRuntimeContext,
  getOptionalRuntime,
  RUNTIME_CONTEXT,
  type RuntimeContextValue,
} from './runtime/context';
export { default as RuntimeProvider } from './runtime/RuntimeProvider.svelte';
