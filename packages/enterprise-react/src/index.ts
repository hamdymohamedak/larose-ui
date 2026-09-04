export {
  AuditProvider,
  useAudit,
  useOptionalAudit,
  type AuditProviderProps,
} from './audit/AuditProvider';
export { AuditedInput, type AuditedInputProps } from './audit/AuditedInput';
export { AuditHistory, type AuditHistoryProps } from './audit/AuditHistory';
export type { AuditEntry, AuditContextValue } from '@larose-ui/enterprise-core';
export { createAuditStore } from '@larose-ui/enterprise-core';

export {
  checkVersionCompatibility,
  type VersionCheckOptions,
} from '@larose-ui/enterprise-core';
export {
  VersionProvider,
  useVersion,
  useOptionalVersion,
  type VersionProviderProps,
} from './version/VersionProvider';

export {
  compileFormSchema,
  validateUISchema,
  type UISchema,
  type UISchemaField,
  type UISchemaType,
} from '@larose-ui/enterprise-core';
export { SchemaRenderer, type SchemaRendererProps } from './schema/SchemaRenderer';

export { SensitiveAction, type SensitiveActionProps } from './security/SensitiveAction';
export {
  SessionGuard,
  notifySessionExpired,
  type SessionGuardProps,
} from './security/SessionGuard';
