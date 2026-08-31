import type { RuntimeStore } from '@larose-ui/runtime-core';
import type { LaRoseRuntimeContext, SessionState } from '@larose-ui/core';

export interface RuntimeContextValue {
  context: LaRoseRuntimeContext;
  store: RuntimeStore;
  setContext: (patch: Partial<LaRoseRuntimeContext>) => void;
  setSession: (session: SessionState) => void;
}

export const runtimeContextKey = Symbol('larose-runtime');
