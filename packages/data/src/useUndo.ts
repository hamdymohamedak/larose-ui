import { useCallback, useEffect, useRef, useState } from 'react';
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
  const [actions, setActions] = useState<UndoAction[]>([]);
  const timersRef = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      for (const timer of timers.values()) clearTimeout(timer);
      timers.clear();
    };
  }, []);

  const register = useCallback(
    <T,>(label: string, data: T, undoFn: () => void | Promise<void>): string => {
      const action = createUndoAction(label, data, undoFn, timeoutMs);
      setActions((prev) => [...prev, action as UndoAction]);

      const timer = setTimeout(() => {
        setActions((prev) => removeUndoAction(prev, action.id));
        timersRef.current.delete(action.id);
      }, timeoutMs);
      timersRef.current.set(action.id, timer);

      return action.id;
    },
    [timeoutMs],
  );

  const executeUndo = useCallback(async (id: string) => {
    let action: UndoAction | undefined;
    setActions((prev) => {
      action = findUndoAction(prev, id);
      return action ? removeUndoAction(prev, id) : prev;
    });
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
    if (action) await action.undo();
  }, []);

  const dismiss = useCallback((id: string) => {
    setActions((prev) => removeUndoAction(prev, id));
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  return { actions, register, executeUndo, dismiss };
}
