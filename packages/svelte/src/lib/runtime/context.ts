import { getContext, setContext } from 'svelte';
import type { RuntimeStore } from '@larose-ui/runtime-core';
import type { LaRoseRuntimeContext, SessionState } from '@larose-ui/core';

export interface RuntimeContextValue {
  get context(): LaRoseRuntimeContext;
  store: RuntimeStore;
  setContext: (patch: Partial<LaRoseRuntimeContext>) => void;
  setSession: (session: SessionState) => void;
}

export const runtimeContextKey = Symbol('larose-runtime');

export function setRuntimeContext(value: RuntimeContextValue): void {
  setContext(runtimeContextKey, value);
}

export function getRuntimeContext(): RuntimeContextValue {
  const ctx = getContext<RuntimeContextValue>(runtimeContextKey);
  if (!ctx) {
    throw new Error('getRuntimeContext must be used within RuntimeProvider');
  }
  return ctx;
}
