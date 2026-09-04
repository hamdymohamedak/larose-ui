export interface UndoAction<T = unknown> {
  id: string;
  label: string;
  data: T;
  undo: () => void | Promise<void>;
  expiresAt: number;
}

export interface UndoOptions {
  timeoutMs?: number;
}

export const DEFAULT_UNDO_TIMEOUT_MS = 8000;

export function createUndoId(): string {
  return `undo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createUndoAction<T>(
  label: string,
  data: T,
  undoFn: () => void | Promise<void>,
  timeoutMs: number = DEFAULT_UNDO_TIMEOUT_MS,
  id: string = createUndoId(),
): UndoAction<T> {
  return {
    id,
    label,
    data,
    undo: undoFn,
    expiresAt: Date.now() + timeoutMs,
  };
}

export function removeUndoAction(actions: UndoAction[], id: string): UndoAction[] {
  return actions.filter((action) => action.id !== id);
}

export function findUndoAction(
  actions: UndoAction[],
  id: string,
): UndoAction | undefined {
  return actions.find((action) => action.id === id);
}
