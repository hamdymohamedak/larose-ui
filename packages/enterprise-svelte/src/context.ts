import { getContext, setContext } from 'svelte';
import {
  createAuditStore,
  type AuditStore,
} from '@larose-ui/enterprise-core';

export const AUDIT_CONTEXT = 'larose-audit';

export function setAuditContext(store: AuditStore): void {
  setContext(AUDIT_CONTEXT, store);
}

export function getAuditContext(): AuditStore {
  const store = getContext<AuditStore | undefined>(AUDIT_CONTEXT);
  if (!store) throw new Error('getAuditContext must be used within AuditProvider');
  return store;
}

export function getOptionalAuditContext(): AuditStore | null {
  return getContext<AuditStore | undefined>(AUDIT_CONTEXT) ?? null;
}

export function createAuditContext(actor = 'system'): AuditStore {
  return createAuditStore({ actor });
}
