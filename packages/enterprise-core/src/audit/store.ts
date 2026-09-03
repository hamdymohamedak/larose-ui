import type { AuditEntry, AuditContextValue } from './types';

export interface AuditStoreOptions {
  actor?: string;
  initialEntries?: AuditEntry[];
}

export interface AuditStore extends AuditContextValue {
  subscribe: (listener: () => void) => () => void;
  setActor: (actor: string) => void;
}

export function createAuditStore(options: AuditStoreOptions = {}): AuditStore {
  let actor = options.actor ?? 'system';
  let entries = [...(options.initialEntries ?? [])];
  const listeners = new Set<() => void>();

  const notify = () => {
    for (const listener of listeners) listener();
  };

  return {
    get actor() {
      return actor;
    },
    get entries() {
      return entries;
    },
    setActor(next) {
      actor = next;
      notify();
    },
    recordChange(entry) {
      const next: AuditEntry = {
        ...entry,
        id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        timestamp: new Date().toISOString(),
        actor,
      };
      entries = [next, ...entries];
      notify();
    },
    getHistory(field, resourceId) {
      return entries.filter(
        (e) =>
          e.field === field &&
          (resourceId === undefined || e.resourceId === resourceId),
      );
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
