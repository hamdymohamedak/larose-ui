import {
  createMockAdapter,
  createAIRuntime,
  type AIAdapter,
  type AIRuntime,
} from '@larose-ui/ai-core';
import { getPermissionsContext } from '@larose-ui/permissions-svelte';
import { get } from 'svelte/store';
import { getOptionalAIContext } from './context';

export function getSmartAIRuntime(adapter?: AIAdapter): AIRuntime {
  const optional = getOptionalAIContext();
  if (optional) return optional;
  const permissions = getPermissionsContext();
  return createAIRuntime({
    adapter: adapter ?? createMockAdapter(),
    grantedPermissions: () => get(permissions).permissions,
  });
}
