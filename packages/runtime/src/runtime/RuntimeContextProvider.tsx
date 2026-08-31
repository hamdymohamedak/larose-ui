import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import { createRuntimeStore, type RuntimeStore } from '@larose-ui/runtime-core';
import type { LaRoseRuntimeContext, RuntimeEvent, SessionState } from '@larose-ui/core';

export interface RuntimeContextStoreValue {
  context: LaRoseRuntimeContext;
  store: RuntimeStore;
  setContext: (patch: Partial<LaRoseRuntimeContext>) => void;
  setSession: (session: SessionState) => void;
  eventBus: RuntimeStore['eventBus'];
}

export const RuntimeContext = createContext<RuntimeContextStoreValue | null>(null);

export interface RuntimeContextProviderProps {
  children: ReactNode;
  initialContext?: Partial<LaRoseRuntimeContext>;
  eventBus?: RuntimeStore['eventBus'];
  onEvent?: (event: RuntimeEvent) => void;
}

export function RuntimeContextProvider({
  children,
  initialContext,
  eventBus,
  onEvent,
}: RuntimeContextProviderProps) {
  const storeRef = useRef<RuntimeStore>(
    createRuntimeStore({ initialContext, eventBus }),
  );
  const store = storeRef.current;

  const context = useSyncExternalStore(
    (onStoreChange) => store.subscribe(() => onStoreChange()),
    () => store.getContext(),
    () => store.getContext(),
  );

  useEffect(() => {
    return store.bindA11yPreferences();
  }, [store]);

  useEffect(() => {
    if (!onEvent) return;
    return store.eventBus.subscribe(onEvent);
  }, [onEvent, store]);

  const setContext = useCallback(
    (patch: Partial<LaRoseRuntimeContext>) => {
      store.setContext(patch);
    },
    [store],
  );

  const setSession = useCallback(
    (session: SessionState) => {
      store.setSession(session);
    },
    [store],
  );

  const value = useMemo<RuntimeContextStoreValue>(
    () => ({
      context,
      store,
      setContext,
      setSession,
      eventBus: store.eventBus,
    }),
    [context, store, setContext, setSession],
  );

  useEffect(() => {
    store.mount();
  }, [store]);

  return (
    <RuntimeContext.Provider value={value}>{children}</RuntimeContext.Provider>
  );
}

export function useRuntimeStore(): RuntimeContextStoreValue {
  const store = useContext(RuntimeContext);
  if (!store) {
    throw new Error('useRuntimeStore must be used within RuntimeContextProvider');
  }
  return store;
}

export function useOptionalRuntimeStore(): RuntimeContextStoreValue | null {
  return useContext(RuntimeContext);
}

export type { LaRoseRuntimeContext, RuntimeEvent };
