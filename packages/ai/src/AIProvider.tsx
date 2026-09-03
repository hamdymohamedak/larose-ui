import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { usePermissions } from '@larose-ui/permissions';
import {
  createMockAdapter,
  createAIRuntime,
  type AIAdapter,
  type AIRuntime,
  type AIAuditEvent,
} from '@larose-ui/ai-core';

export interface AIProviderProps {
  children: ReactNode;
  adapter?: AIAdapter;
  onAudit?: (event: AIAuditEvent) => void;
}

const AIContext = createContext<AIRuntime | null>(null);

export function AIProvider({ children, adapter, onAudit }: AIProviderProps) {
  const { permissions } = usePermissions();
  const runtime = useMemo(
    () =>
      createAIRuntime({
        adapter: adapter ?? createMockAdapter(),
        grantedPermissions: () => permissions,
        onAudit,
      }),
    [adapter, permissions, onAudit],
  );

  return <AIContext.Provider value={runtime}>{children}</AIContext.Provider>;
}

export function useAIRuntime(): AIRuntime {
  const runtime = useContext(AIContext);
  if (!runtime) {
    throw new Error('useAIRuntime must be used within AIProvider');
  }
  return runtime;
}

export function useOptionalAIRuntime(): AIRuntime | null {
  return useContext(AIContext);
}
