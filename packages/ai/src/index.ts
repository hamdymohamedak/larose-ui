export type {
  AIAdapter,
  AIAdapterContext,
  FormFillResult,
  TableFilterResult,
} from './adapter';
export { createMockAdapter } from './adapters/mockAdapter';
export {
  createHttpAdapter,
  createFallbackAdapter,
  type HttpAdapterOptions,
} from './adapters/httpAdapter';
export { parseIntent, sanitizePrompt, type AIIntent, type AIIntentType } from './intent';
export {
  checkIntentPermission,
  checkActionPermission,
  resolveIntentPermission,
  type IntentPermissionResult,
} from './permissions';
export {
  createAIRuntime,
  type AIRuntime,
  type AIRuntimeConfig,
  type AIExecutionResult,
  type AIAuditEvent,
} from './runtime';
export { AIProvider, useAIRuntime, useOptionalAIRuntime, type AIProviderProps } from './AIProvider';
export { useSmartAIRuntime } from './useSmartAIRuntime';
export { SmartTable, type SmartTableProps } from './SmartTable';
export { SmartForm, type SmartFormProps } from './SmartForm';
