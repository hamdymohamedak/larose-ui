import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { AuditContextValue, AuditEntry } from './types';

const AuditContext = createContext<AuditContextValue | null>(null);

export interface AuditProviderProps {
  actor?: string;
  children: ReactNode;
}

export function AuditProvider({ actor = 'system', children }: AuditProviderProps) {
  const [entries, setEntries] = useState<AuditEntry[]>([]);

  const recordChange = useCallback(
    (entry: Omit<AuditEntry, 'id' | 'timestamp' | 'actor'>) => {
      setEntries((prev) => [
        {
          ...entry,
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          actor,
          timestamp: new Date().toISOString(),
        },
        ...prev,
      ]);
    },
    [actor],
  );

  const getHistory = useCallback(
    (field: string, resourceId?: string) =>
      entries.filter(
        (e) => e.field === field && (resourceId === undefined || e.resourceId === resourceId),
      ),
    [entries],
  );

  const value = useMemo(
    () => ({ actor, entries, recordChange, getHistory }),
    [actor, entries, recordChange, getHistory],
  );

  return <AuditContext.Provider value={value}>{children}</AuditContext.Provider>;
}

export function useAudit(): AuditContextValue {
  const ctx = useContext(AuditContext);
  if (!ctx) {
    throw new Error('useAudit must be used within AuditProvider');
  }
  return ctx;
}

export function useOptionalAudit(): AuditContextValue | null {
  return useContext(AuditContext);
}
