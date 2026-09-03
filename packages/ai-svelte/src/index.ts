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
  AI_CONTEXT,
  setAIContext,
  getAIContext,
  getOptionalAIContext,
  createAIRuntimeFromPermissions,
} from './context';
export { default as AIProvider } from './AIProvider.svelte';
export { getSmartAIRuntime } from './getSmartAIRuntime';
export { default as SmartTable } from './SmartTable.svelte';
export { default as SmartForm } from './SmartForm.svelte';
