import { getContext, setContext } from 'svelte';
import { get } from 'svelte/store';
import {
  createAIRuntime,
  createMockAdapter,
  type AIAdapter,
  type AIAuditEvent,
  type AIRuntime,
} from '@larose-ui/ai-core';
import { getPermissionsContext } from '@larose-ui/permissions-svelte';

export const AI_CONTEXT = 'larose-ai';

export function setAIContext(runtime: AIRuntime): void {
  setContext(AI_CONTEXT, runtime);
}

export function getAIContext(): AIRuntime {
  const runtime = getContext<AIRuntime | undefined>(AI_CONTEXT);
  if (!runtime) throw new Error('getAIContext must be used within AIProvider');
  return runtime;
}

export function getOptionalAIContext(): AIRuntime | null {
  return getContext<AIRuntime | undefined>(AI_CONTEXT) ?? null;
}

export function createAIRuntimeFromPermissions(
  adapter?: AIAdapter,
  onAudit?: (event: AIAuditEvent) => void,
): AIRuntime {
  const permissions = getPermissionsContext();
  return createAIRuntime({
    adapter: adapter ?? createMockAdapter(),
    grantedPermissions: () => get(permissions).permissions,
    onAudit,
  });
}
