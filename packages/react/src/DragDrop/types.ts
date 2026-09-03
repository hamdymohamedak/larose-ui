import type { ReactNode } from 'react';
import type {
  DragItem as CoreDragItem,
  DragSession,
  DropOperation,
  DropResult,
  DropTargetState,
} from '@larose-ui/primitives';

export type { DropOperation, DragSession, DropTargetState, DropResult };

export interface DragItem<T = unknown> extends Omit<CoreDragItem<T>, 'preview'> {
  preview?: ReactNode;
}
