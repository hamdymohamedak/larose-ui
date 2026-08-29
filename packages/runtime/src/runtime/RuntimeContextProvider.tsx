import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  createDefaultRuntimeContext,
  createRuntimeEventBus,
  detectA11yPreferences,
  subscribeA11yPreferences,
  type LaRoseRuntimeContext,
  type RuntimeEvent,
  type RuntimeEventBus,
  type SessionState,
} from '@larose/core';

export interface RuntimeContextStoreValue {
  context: LaRoseRuntimeContext;
  eventBus: RuntimeEventBus;
  setContext: (patch: Partial<LaRoseRuntimeContext>) => void;
  setSession: (session: SessionState) => void;
}

export const RuntimeContext = createContext<RuntimeContextStoreValue | null>(null);

export interface RuntimeContextProviderProps {
  children: ReactNode;
  initialContext?: Partial<LaRoseRuntimeContext>;
  eventBus?: RuntimeEventBus;
  onEvent?: (event: RuntimeEvent) => void;
}

export function RuntimeContextProvider({
  children,
  initialContext,
  eventBus: externalBus,
  onEvent,
}: RuntimeContextProviderProps) {
  const eventBusRef = useRef(externalBus ?? createRuntimeEventBus());

  const [context, setContextState] = useState<LaRoseRuntimeContext>(() =>
    createDefaultRuntimeContext({
      accessibility: detectA11yPreferences(),
      ...initialContext,
    }),
  );

  useEffect(() => {
    return subscribeA11yPreferences((accessibility) => {
      setContextState((prev) => ({ ...prev, accessibility }));
    });
  }, []);

  useEffect(() => {
    if (!onEvent) return;
    return eventBusRef.current.subscribe(onEvent);
  }, [onEvent]);

  const setContext = useCallback((patch: Partial<LaRoseRuntimeContext>) => {
    setContextState((prev) => {
      const next = { ...prev, ...patch };
      eventBusRef.current.emit({
        type: 'runtime.updated',
        metadata: { keys: Object.keys(patch) },
      });
      return next;
    });
  }, []);

  const setSession = useCallback((session: SessionState) => {
    setContextState((prev) => {
      if (prev.session === session) return prev;
      eventBusRef.current.emit({
        type: 'session.transition',
        metadata: { from: prev.session, to: session },
      });
      return { ...prev, session };
    });
  }, []);

  const value = useMemo<RuntimeContextStoreValue>(
    () => ({
      context,
      eventBus: eventBusRef.current,
      setContext,
      setSession,
    }),
    [context, setContext, setSession],
  );

  useEffect(() => {
    eventBusRef.current.emit({ type: 'runtime.mounted' });
  }, []);

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
