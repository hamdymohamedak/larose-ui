import { inject } from 'vue';
import { runtimeContextKey, type RuntimeContextValue } from '../runtime/types';

export function useRuntimeContext(): RuntimeContextValue {
  const context = inject(runtimeContextKey);
  if (!context) {
    throw new Error('useRuntimeContext must be used within RuntimeProvider');
  }
  return context as RuntimeContextValue;
}

export type { RuntimeContextValue } from '../runtime/types';
