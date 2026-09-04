import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { useDragDropContext } from './DragDropContext';
import type { DragItem, DropResult } from './types';
import styles from '@larose-ui/styles/components/DragDrop/DragDrop.module.css';

export interface DropZoneProps<T = unknown> {
  id: string;
  accepts?: string | string[];
  disabled?: boolean;
  canDrop?: (items: DragItem<T>[]) => boolean;
  onDrop: (result: DropResult<T>) => void | Promise<void>;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  showInvalidIndicator?: boolean;
  transferring?: boolean;
  transferringLabel?: string;
}

export function DropZone<T>({
  id,
  accepts,
  disabled = false,
  canDrop,
  onDrop,
  children,
  className,
  style,
  showInvalidIndicator = true,
  transferring = false,
  transferringLabel = 'Transferring…',
}: DropZoneProps<T>) {
  const { session, target, registerZone } = useDragDropContext<T>();
  const [element, setElement] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!element) return;
    return registerZone({
      id,
      accepts,
      canDrop,
      onDrop,
      element,
    });
  }, [element, id, accepts, canDrop, onDrop, registerZone]);

  const isActive = target?.zoneId === id && target.valid;
  const isInvalid = target?.zoneId === id && !target.valid;
  const state = isActive ? 'active' : isInvalid ? 'invalid' : 'idle';

  return (
    <div
      ref={setElement}
      className={[styles.dropZone, className].filter(Boolean).join(' ')}
      style={style}
      data-state={state}
      data-disabled={disabled ? 'true' : undefined}
      aria-dropeffect={disabled ? 'none' : isActive ? 'move' : undefined}
    >
      {transferring ? (
        <div className={styles.placeholder} role="status">
          {transferringLabel}
        </div>
      ) : (
        children
      )}
      {isInvalid && showInvalidIndicator && session && (
        <div className={styles.invalidIcon} aria-hidden="true">
          ⊘
        </div>
      )}
    </div>
  );
}
