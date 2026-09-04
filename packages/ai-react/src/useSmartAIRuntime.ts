import { useMemo } from 'react';
import { usePermissions } from '@larose-ui/permissions-react';
import {
  createMockAdapter,
  createAIRuntime,
  type AIAdapter,
  type AIRuntime,
} from '@larose-ui/ai-core';
import { useOptionalAIRuntime } from './AIProvider';

export function useSmartAIRuntime(adapter?: AIAdapter): AIRuntime {
  const optional = useOptionalAIRuntime();
  const { permissions } = usePermissions();

  return useMemo(() => {
    if (optional) return optional;
    return createAIRuntime({
      adapter: adapter ?? createMockAdapter(),
      grantedPermissions: () => permissions,
    });
  }, [optional, adapter, permissions]);
}
