import type { ReactNode } from 'react';

export type DropOperation = 'move' | 'copy';

export interface DragItem<T = unknown> {
  id: string;
  type?: string;
  data: T;
  sourceId: string;
  preview?: ReactNode;
  label?: string;
}

export interface DragSession<T = unknown> {
  items: DragItem<T>[];
  sourceId: string;
  pointerId: number;
  startX: number;
  startY: number;
  x: number;
  y: number;
}

export interface DropTargetState {
  zoneId: string;
  valid: boolean;
}

export interface DropResult<T = unknown> {
  items: DragItem<T>[];
  sourceId: string;
  destinationId: string;
  operation: DropOperation;
}
