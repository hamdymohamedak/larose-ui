import { useCallback, useState } from 'react';

export interface UndoAction<T = unknown> {
  id: string;
  label: string;
  data: T;
  undo: () => void | Promise<void>;
  expiresAt: number;
}

export interface UseUndoOptions {
  timeoutMs?: number;
}

export function useUndo(options: UseUndoOptions = {}) {
  const { timeoutMs = 8000 } = options;
  const [actions, setActions] = useState<UndoAction[]>([]);

  const register = useCallback(
    <T,>(label: string, data: T, undoFn: () => void | Promise<void>): string => {
      const id = `undo-${Date.now()}`;
      const action: UndoAction<T> = {
        id,
        label,
        data,
        undo: undoFn,
        expiresAt: Date.now() + timeoutMs,
      };

      setActions((prev) => [...prev, action as UndoAction]);

      setTimeout(() => {
        setActions((prev) => prev.filter((a) => a.id !== id));
      }, timeoutMs);

      return id;
    },
    [timeoutMs],
  );

  const executeUndo = useCallback(async (id: string) => {
    const action = actions.find((a) => a.id === id);
    if (action) {
      await action.undo();
      setActions((prev) => prev.filter((a) => a.id !== id));
    }
  }, [actions]);

  const dismiss = useCallback((id: string) => {
    setActions((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return { actions, register, executeUndo, dismiss };
}
