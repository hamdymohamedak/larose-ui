import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import { DRAG_START_THRESHOLD_PX } from '@larose-ui/tokens';
import { useDragDropContext } from './DragDropContext';
import type { DragItem } from './types';
import { distance } from './utils';
import styles from './DragDrop.module.css';

export interface DraggableProps<T = unknown> {
  id: string;
  sourceId: string;
  data: T;
  type?: string;
  label?: string;
  preview?: ReactNode;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
}

export function Draggable<T>({
  id,
  sourceId,
  data,
  type,
  label,
  preview,
  disabled = false,
  children,
  className,
}: DraggableProps<T>) {
  const {
    session,
    beginPointerDrag,
    addItemToSession,
    updatePointer,
    endPointer,
    cancelPointer,
  } = useDragDropContext<T>();

  const ref = useRef<HTMLDivElement>(null);
  const [pending, setPending] = useState(false);
  const originRef = useRef<{ x: number; y: number; pointerId: number } | null>(null);

  const isDragging =
    session?.items.some((item) => item.id === id) ?? false;

  useEffect(() => {
    if (!session) {
      setPending(false);
      originRef.current = null;
    }
  }, [session]);

  useEffect(() => {
    if (!session || session.pointerId !== originRef.current?.pointerId) return;

    const onMove = (event: globalThis.PointerEvent) => {
      if (event.pointerId !== session.pointerId) return;
      updatePointer(event.clientX, event.clientY);
    };

    const onUp = (event: globalThis.PointerEvent) => {
      if (event.pointerId !== session.pointerId) return;
      void endPointer(event.clientX, event.clientY, event.altKey);
    };

    const onCancel = (event: globalThis.PointerEvent) => {
      if (event.pointerId !== session.pointerId) return;
      cancelPointer();
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onCancel);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onCancel);
    };
  }, [session, updatePointer, endPointer, cancelPointer]);

  const buildItem = (): DragItem<T> => ({
    id,
    sourceId,
    data,
    type,
    label,
    preview,
  });

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (disabled || event.button !== 0) return;
    originRef.current = {
      x: event.clientX,
      y: event.clientY,
      pointerId: event.pointerId,
    };
    setPending(true);
    ref.current?.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!pending || !originRef.current) return;
    if (event.pointerId !== originRef.current.pointerId) return;

    const moved = distance(
      originRef.current.x,
      originRef.current.y,
      event.clientX,
      event.clientY,
    );

    if (!session && moved >= DRAG_START_THRESHOLD_PX) {
      beginPointerDrag(
        buildItem(),
        event.pointerId,
        event.clientX,
        event.clientY,
        ref.current!,
      );
      setPending(false);
      return;
    }

    if (session && session.pointerId === event.pointerId) {
      updatePointer(event.clientX, event.clientY);
    }
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (session && session.pointerId === event.pointerId) {
      void endPointer(event.clientX, event.clientY, event.altKey);
    }
    if (pending && session && event.shiftKey) {
      addItemToSession(buildItem());
    }
    setPending(false);
    originRef.current = null;
  };

  return (
    <div
      ref={ref}
      className={[styles.draggable, className].filter(Boolean).join(' ')}
      data-dragging={isDragging ? 'true' : undefined}
      data-disabled={disabled ? 'true' : undefined}
      aria-grabbed={isDragging ? true : undefined}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {children}
    </div>
  );
}
