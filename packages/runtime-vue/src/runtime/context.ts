import { inject, provide, type InjectionKey, ref, onMounted, onUnmounted } from 'vue';
import { createRuntimeStore, type RuntimeStore } from '@larose-ui/runtime-core';
import type { LaRoseRuntimeContext, RuntimeEvent, SessionState } from '@larose-ui/core';

export interface RuntimeContextValue {
  context: LaRoseRuntimeContext;
  store: RuntimeStore;
  setContext: (patch: Partial<LaRoseRuntimeContext>) => void;
  setSession: (session: SessionState) => void;
}

export const RUNTIME_KEY: InjectionKey<RuntimeContextValue> = Symbol('larose-runtime');

export function createRuntimeContext(
  initialContext?: Partial<LaRoseRuntimeContext>,
  onEvent?: (event: RuntimeEvent) => void,
): {
  value: RuntimeContextValue;
  mount: () => void;
  unmount: () => void;
} {
  const store = createRuntimeStore({ initialContext });
  const context = ref(store.getContext());
  let unsubscribeStore: (() => void) | undefined;
  let unsubscribeEvents: (() => void) | undefined;
  let unbindA11y: (() => void) | undefined;

  const value: RuntimeContextValue = {
    get context() {
      return context.value;
    },
    store,
    setContext(patch) {
      store.setContext(patch);
    },
    setSession(session) {
      store.setSession(session);
    },
  };

  return {
    value,
    mount() {
      unsubscribeStore = store.subscribe(() => {
        context.value = store.getContext();
      });
      unbindA11y = store.bindA11yPreferences();
      if (onEvent) unsubscribeEvents = store.eventBus.subscribe(onEvent);
    },
    unmount() {
      unsubscribeStore?.();
      unsubscribeEvents?.();
      unbindA11y?.();
    },
  };
}

export function provideRuntime(value: RuntimeContextValue): void {
  provide(RUNTIME_KEY, value);
}

export function useRuntimeContext(): RuntimeContextValue {
  const ctx = inject(RUNTIME_KEY, null);
  if (!ctx) throw new Error('useRuntimeContext must be used within RuntimeProvider');
  return ctx;
}

export function useOptionalRuntime(): RuntimeContextValue | null {
  return inject(RUNTIME_KEY, null);
}
