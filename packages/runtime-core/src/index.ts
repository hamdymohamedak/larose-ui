export type { FeatureState } from './types';

export { RuntimeStore, createRuntimeStore } from './store';
export type { RuntimeStoreOptions, RuntimeStoreListener } from './store';

export {
  buildFeatureSnapshot,
  buildRuntimeContextPatch,
  serializeRuntimePatch,
  createNetworkTransitionEvent,
  sessionStateFromHttpCode,
} from './bridge';
export type { RuntimeDomainInput, VersionInput } from './bridge';

export {
  shouldClearOfflineQueueOnSession,
  shouldSyncOfflineQueue,
} from './sessionSecurity';

export { resolveTenantConfig } from './tenant/resolveTenant';
export type { TenantResolutionInput, ResolvedTenantConfig } from './tenant/resolveTenant';

export {
  createTranslator,
  defaultMessages,
  isRtlLocale,
  rtlLocales,
} from './i18n/messages';
export type { Locale, MessageKey, Messages } from './i18n/messages';

export {
  defaultBreakpoints,
  resolveBreakpoint,
  buildResponsiveSnapshot,
  detectTouchCapability,
  getViewportWidth,
} from './responsive/breakpoints';
export type { Breakpoint, BreakpointConfig, ResponsiveSnapshot } from './responsive/breakpoints';

export {
  detectHostEnvironment,
  capabilitiesForPlatform,
} from './environment/host';
export type {
  HostPlatform,
  HostOS,
  HostCapabilities,
  HostEnvironment,
} from './environment/host';

export type {
  LaRoseRuntimeContext,
  RuntimeEvent,
  RuntimeEventBus,
  SessionState,
  Environment,
  FeatureFlagEvaluator,
  TenantContext,
  UserContext,
} from '@larose-ui/core';

export {
  createDefaultRuntimeContext,
  createRuntimeEventBus,
  createSessionStateMachine,
} from '@larose-ui/core';
