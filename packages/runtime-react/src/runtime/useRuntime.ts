import { useContext, useMemo } from 'react';
import type { LaRoseRuntimeContext, RuntimeEvent } from '@larose-ui/core';
import { RuntimeContext, useRuntimeStore } from './RuntimeContextProvider';

export function useRuntime(): LaRoseRuntimeContext {
  return useRuntimeStore().context;
}

export function useRuntimeSelector<T>(
  selector: (context: LaRoseRuntimeContext) => T,
): T {
  const { context } = useRuntimeStore();
  return useMemo(() => selector(context), [context, selector]);
}

export function useRuntimeEvents() {
  const { eventBus } = useRuntimeStore();
  return useMemo(
    () => ({
      getTimeline: eventBus.getTimeline.bind(eventBus),
      emit: eventBus.emit.bind(eventBus),
      subscribe: eventBus.subscribe.bind(eventBus),
    }),
    [eventBus],
  );
}

export function useOptionalRuntimeEvents() {
  const store = useContext(RuntimeContext);
  return useMemo(() => {
    if (!store) return null;
    return {
      getTimeline: store.eventBus.getTimeline.bind(store.eventBus),
      emit: store.eventBus.emit.bind(store.eventBus),
      subscribe: store.eventBus.subscribe.bind(store.eventBus),
    };
  }, [store]);
}

export function useOptionalRuntime(): LaRoseRuntimeContext | null {
  return useContext(RuntimeContext)?.context ?? null;
}

export function useSession(): SessionSlice {
  const { context, setSession } = useRuntimeStore();
  return {
    state: context.session,
    isAuthenticated: context.session === 'authenticated',
    setSession,
  };
}

export interface SessionSlice {
  state: LaRoseRuntimeContext['session'];
  isAuthenticated: boolean;
  setSession: (state: LaRoseRuntimeContext['session']) => void;
}

export type { RuntimeEvent };
