import { getContext, setContext } from 'svelte';
import { createRuntimeStore, type RuntimeStore } from '@larose-ui/runtime-core';
import type { LaRoseRuntimeContext, RuntimeEvent, SessionState } from '@larose-ui/core';

export interface RuntimeContextValue {
  getContext: () => LaRoseRuntimeContext;
  store: RuntimeStore;
  setContext: (patch: Partial<LaRoseRuntimeContext>) => void;
  setSession: (session: SessionState) => void;
}

export const RUNTIME_CONTEXT = 'larose-runtime';

export function createRuntimeContext(
  initialContext?: Partial<LaRoseRuntimeContext>,
  onEvent?: (event: RuntimeEvent) => void,
): RuntimeContextValue & { mount: () => void; unmount: () => void } {
  const store = createRuntimeStore({ initialContext });
  let unsubscribeEvents: (() => void) | undefined;
  let unbindA11y: (() => void) | undefined;

  return {
    store,
    getContext: () => store.getContext(),
    setContext: (patch) => store.setContext(patch),
    setSession: (session) => store.setSession(session),
    mount() {
      unbindA11y = store.bindA11yPreferences();
      if (onEvent) unsubscribeEvents = store.eventBus.subscribe(onEvent);
    },
    unmount() {
      unsubscribeEvents?.();
      unbindA11y?.();
    },
  };
}

export function setRuntimeContext(value: RuntimeContextValue): void {
  setContext(RUNTIME_CONTEXT, value);
}

export function getRuntimeContext(): RuntimeContextValue {
  const ctx = getContext<RuntimeContextValue | undefined>(RUNTIME_CONTEXT);
  if (!ctx) throw new Error('getRuntimeContext must be used within RuntimeProvider');
  return ctx;
}

export function getOptionalRuntime(): RuntimeContextValue | null {
  return getContext<RuntimeContextValue | undefined>(RUNTIME_CONTEXT) ?? null;
}
