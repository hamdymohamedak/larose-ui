import { getCurrentInstance, onUnmounted, ref } from 'vue';
import {
  DEFAULT_UNDO_TIMEOUT_MS,
  createUndoAction,
  findUndoAction,
  removeUndoAction,
  type UndoAction,
  type UndoOptions,
} from '@larose-ui/data-core';

export type { UndoAction, UndoOptions as UseUndoOptions };

export function useUndo(options: UndoOptions = {}) {
  const { timeoutMs = DEFAULT_UNDO_TIMEOUT_MS } = options;
  const actions = ref<UndoAction[]>([]);
  const timers = new Map<string, ReturnType<typeof setTimeout>>();

  function clearTimers() {
    for (const timer of timers.values()) clearTimeout(timer);
    timers.clear();
  }

  if (getCurrentInstance()) {
    onUnmounted(clearTimers);
  }

  function register<T>(
    label: string,
    data: T,
    undoFn: () => void | Promise<void>,
  ): string {
    const action = createUndoAction(label, data, undoFn, timeoutMs);
    actions.value = [...actions.value, action as UndoAction];
    const timer = setTimeout(() => {
      actions.value = removeUndoAction(actions.value, action.id);
      timers.delete(action.id);
    }, timeoutMs);
    timers.set(action.id, timer);
    return action.id;
  }

  async function executeUndo(id: string) {
    const action = findUndoAction(actions.value, id);
    if (!action) return;
    actions.value = removeUndoAction(actions.value, id);
    const timer = timers.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.delete(id);
    }
    await action.undo();
  }

  function dismiss(id: string) {
    actions.value = removeUndoAction(actions.value, id);
    const timer = timers.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.delete(id);
    }
  }

  return { actions, register, executeUndo, dismiss, clearTimers };
}
