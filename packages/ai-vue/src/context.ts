import { inject, provide, type InjectionKey } from 'vue';
import {
  createAIRuntime,
  createMockAdapter,
  type AIAdapter,
  type AIAuditEvent,
  type AIRuntime,
} from '@larose-ui/ai-core';
import { usePermissions } from '@larose-ui/permissions-vue';

export const AI_KEY: InjectionKey<AIRuntime> = Symbol('larose-ai');

export function createAIRuntimeFromPermissions(
  adapter?: AIAdapter,
  onAudit?: (event: AIAuditEvent) => void,
): AIRuntime {
  const { permissions } = usePermissions();
  return createAIRuntime({
    adapter: adapter ?? createMockAdapter(),
    grantedPermissions: () => permissions,
    onAudit,
  });
}

export function provideAI(runtime: AIRuntime): void {
  provide(AI_KEY, runtime);
}

export function useAIRuntime(): AIRuntime {
  const runtime = inject(AI_KEY, null);
  if (!runtime) throw new Error('useAIRuntime must be used within AIProvider');
  return runtime;
}

export function useOptionalAIRuntime(): AIRuntime | null {
  return inject(AI_KEY, null);
}
