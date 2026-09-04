import { inject, provide, type InjectionKey, type Ref } from 'vue';
import type { DragItem, DragSession, DropResult, DropTargetState } from './types';

export interface DropZoneRegistration<T = unknown> {
  id: string;
  accepts?: string | string[];
  canDrop?: (items: DragItem<T>[]) => boolean;
  onDrop: (result: DropResult<T>) => void | Promise<void>;
  element: HTMLElement | null;
}

export interface DragDropContextValue<T = unknown> {
  session: Ref<DragSession<T> | null>;
  target: Ref<DropTargetState | null>;
  registerZone: (zone: DropZoneRegistration<T>) => () => void;
  beginPointerDrag: (
    item: DragItem<T>,
    pointerId: number,
    x: number,
    y: number,
    element?: HTMLElement,
  ) => void;
  addItemToSession: (item: DragItem<T>) => void;
  updatePointer: (x: number, y: number) => void;
  endPointer: (x: number, y: number, optionKey: boolean) => Promise<void>;
  cancelPointer: () => void;
}

export const dragDropKey: InjectionKey<DragDropContextValue> = Symbol('larose-drag-drop');

export function provideDragDrop(value: DragDropContextValue): void {
  provide(dragDropKey, value);
}

export function useDragDropContext<T = unknown>(): DragDropContextValue<T> {
  const ctx = inject(dragDropKey);
  if (!ctx) {
    throw new Error('DragDrop components must be used within DragDropProvider');
  }
  return ctx as DragDropContextValue<T>;
}
