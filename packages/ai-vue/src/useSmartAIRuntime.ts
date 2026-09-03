import { computed } from 'vue';
import { usePermissions } from '@larose-ui/permissions-vue';
import {
  createMockAdapter,
  createAIRuntime,
  type AIAdapter,
  type AIRuntime,
} from '@larose-ui/ai-core';
import { useOptionalAIRuntime } from './context';

export function useSmartAIRuntime(adapter?: AIAdapter): AIRuntime {
  const optional = useOptionalAIRuntime();
  const { permissions } = usePermissions();

  return (
    optional ??
    createAIRuntime({
      adapter: adapter ?? createMockAdapter(),
      grantedPermissions: () => permissions,
    })
  );
}

/** Reactive helper when used inside setup — recreates when optional runtime appears. */
export function useSmartAIRuntimeComputed(adapter?: AIAdapter) {
  const optional = useOptionalAIRuntime();
  const perms = usePermissions();
  return computed(() => {
    if (optional) return optional;
    return createAIRuntime({
      adapter: adapter ?? createMockAdapter(),
      grantedPermissions: () => perms.permissions,
    });
  });
}
