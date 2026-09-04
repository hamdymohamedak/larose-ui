export {
  createMockAdapter,
  createHttpAdapter,
  createFallbackAdapter,
  createAIRuntime,
  parseIntent,
  sanitizePrompt,
  checkIntentPermission,
  checkActionPermission,
  resolveIntentPermission,
} from '@larose-ui/ai-core';
export type {
  AIAdapter,
  AIAdapterContext,
  AIRuntime,
  AIRuntimeConfig,
  AIAuditEvent,
  AIIntent,
  AIIntentType,
  FormFillResult,
  TableFilterResult,
  IntentPermissionResult,
  HttpAdapterOptions,
} from '@larose-ui/ai-core';

export {
  AI_KEY,
  provideAI,
  useAIRuntime,
  useOptionalAIRuntime,
} from './context';
export { default as AIProvider } from './AIProvider.vue';
export { useSmartAIRuntime, useSmartAIRuntimeComputed } from './useSmartAIRuntime';
export { default as SmartTable } from './SmartTable.vue';
export { default as SmartForm } from './SmartForm.vue';
