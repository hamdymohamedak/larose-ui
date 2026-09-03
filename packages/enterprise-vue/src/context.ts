import { inject, provide, reactive, type InjectionKey } from 'vue';
import {
  createAuditStore,
  type AuditContextValue,
  type AuditStore,
} from '@larose-ui/enterprise-core';

export const AUDIT_KEY: InjectionKey<AuditContextValue> = Symbol('larose-audit');

export function createAuditContext(actor = 'system'): AuditStore {
  return createAuditStore({ actor });
}

export function provideAudit(store: AuditStore): void {
  const view = reactive({
    get actor() {
      return store.actor;
    },
    get entries() {
      return store.entries;
    },
    recordChange: store.recordChange.bind(store),
    getHistory: store.getHistory.bind(store),
  });
  store.subscribe(() => {
    // touch reactive getters
    void view.entries;
  });
  provide(AUDIT_KEY, view);
}

export function useAudit(): AuditContextValue {
  const ctx = inject(AUDIT_KEY, null);
  if (!ctx) throw new Error('useAudit must be used within AuditProvider');
  return ctx;
}

export function useOptionalAudit(): AuditContextValue | null {
  return inject(AUDIT_KEY, null);
}
