import { writable, get, type Readable } from 'svelte/store';
import {
  DEFAULT_UNDO_TIMEOUT_MS,
  createUndoAction,
  findUndoAction,
  removeUndoAction,
  type UndoAction,
  type UndoOptions,
} from '@larose-ui/data-core';

export type { UndoAction, UndoOptions as CreateUndoOptions };

export interface UndoController {
  subscribe: Readable<UndoAction[]>['subscribe'];
  register: <T>(
    label: string,
    data: T,
    undoFn: () => void | Promise<void>,
  ) => string;
  executeUndo: (id: string) => Promise<void>;
  dismiss: (id: string) => void;
  destroy: () => void;
}

export function createUndo(options: UndoOptions = {}): UndoController {
  const { timeoutMs = DEFAULT_UNDO_TIMEOUT_MS } = options;
  const store = writable<UndoAction[]>([]);
  const timers = new Map<string, ReturnType<typeof setTimeout>>();

  function register<T>(
    label: string,
    data: T,
    undoFn: () => void | Promise<void>,
  ): string {
    const action = createUndoAction(label, data, undoFn, timeoutMs);
    store.update((prev) => [...prev, action as UndoAction]);
    const timer = setTimeout(() => {
      store.update((prev) => removeUndoAction(prev, action.id));
      timers.delete(action.id);
    }, timeoutMs);
    timers.set(action.id, timer);
    return action.id;
  }

  async function executeUndo(id: string) {
    const action = findUndoAction(get(store), id);
    if (!action) return;
    store.update((prev) => removeUndoAction(prev, id));
    const timer = timers.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.delete(id);
    }
    await action.undo();
  }

  function dismiss(id: string) {
    store.update((prev) => removeUndoAction(prev, id));
    const timer = timers.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.delete(id);
    }
  }

  function destroy() {
    for (const timer of timers.values()) clearTimeout(timer);
    timers.clear();
    store.set([]);
  }

  return {
    subscribe: store.subscribe,
    register,
    executeUndo,
    dismiss,
    destroy,
  };
}
