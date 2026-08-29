import { useMemo } from 'react';
import { usePermissions } from '@larose-ui/permissions';
import type { AIAdapter } from './adapter';
import { createMockAdapter } from './adapters/mockAdapter';
import { useOptionalAIRuntime } from './AIProvider';
import { createAIRuntime, type AIRuntime } from './runtime';

export function useSmartAIRuntime(adapter?: AIAdapter): AIRuntime {
  const optional = useOptionalAIRuntime();
  const { permissions } = usePermissions();

  return useMemo(() => {
    if (optional) return optional;
    return createAIRuntime({
      adapter: adapter ?? createMockAdapter(),
      grantedPermissions: permissions,
    });
  }, [optional, adapter, permissions]);
}
