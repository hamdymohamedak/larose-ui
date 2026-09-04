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

export { parseIntent, sanitizePrompt } from './intent';
export type { AIIntent, AIIntentType } from './intent';

export {
  checkIntentPermission,
  checkActionPermission,
  resolveIntentPermission,
} from './permissions';
export type { IntentPermissionResult } from './permissions';

export { createAIRuntime } from './runtime';
export type {
  AIRuntime,
  AIRuntimeConfig,
  AIExecutionResult,
  AIAuditEvent,
} from './runtime';
