import { getContext, setContext } from 'svelte';
import type { DragItem, DragSession, DropResult, DropTargetState } from './types';

export interface DropZoneRegistration<T = unknown> {
  id: string;
  accepts?: string | string[];
  canDrop?: (items: DragItem<T>[]) => boolean;
  onDrop: (result: DropResult<T>) => void | Promise<void>;
  element: HTMLElement | null;
}

export interface DragDropContextValue<T = unknown> {
  getSession: () => DragSession<T> | null;
  getTarget: () => DropTargetState | null;
  getRevert: () => boolean;
  registerZone: (zone: DropZoneRegistration<T>) => () => void;
  beginPointerDrag: (
    item: DragItem<T>,
    pointerId: number,
    x: number,
    y: number,
    element: HTMLElement,
  ) => void;
  addItemToSession: (item: DragItem<T>) => void;
  updatePointer: (x: number, y: number) => void;
  endPointer: (x: number, y: number, optionKey: boolean) => Promise<void>;
  cancelPointer: () => void;
}

export const dragDropKey = Symbol('larose-drag-drop');

export function setDragDropContext(value: DragDropContextValue): void {
  setContext(dragDropKey, value);
}

export function getDragDropContext<T = unknown>(): DragDropContextValue<T> {
  const ctx = getContext<DragDropContextValue<T> | undefined>(dragDropKey);
  if (!ctx) throw new Error('DragDrop components must be used within DragDropProvider');
  return ctx;
}
