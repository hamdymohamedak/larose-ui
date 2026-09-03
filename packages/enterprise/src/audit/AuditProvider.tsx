import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  createAuditStore,
  type AuditContextValue,
} from '@larose-ui/enterprise-core';

const AuditContext = createContext<AuditContextValue | null>(null);

export interface AuditProviderProps {
  actor?: string;
  children: ReactNode;
}

export function AuditProvider({ actor = 'system', children }: AuditProviderProps) {
  const store = useMemo(() => createAuditStore({ actor }), []);
  const [tick, setTick] = useState(0);

  useEffect(() => store.subscribe(() => setTick((n) => n + 1)), [store]);
  useEffect(() => {
    store.setActor(actor);
  }, [actor, store]);

  const value = useMemo<AuditContextValue>(
    () => ({
      actor: store.actor,
      entries: store.entries,
      recordChange: (entry) => store.recordChange(entry),
      getHistory: (field, resourceId) => store.getHistory(field, resourceId),
    }),
    // tick refreshes when the store mutates
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [store, tick],
  );

  return <AuditContext.Provider value={value}>{children}</AuditContext.Provider>;
}

export function useAudit(): AuditContextValue {
  const ctx = useContext(AuditContext);
  if (!ctx) throw new Error('useAudit must be used within AuditProvider');
  return ctx;
}

export function useOptionalAudit(): AuditContextValue | null {
  return useContext(AuditContext);
}
