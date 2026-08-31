import { useCallback, useState, type ReactNode } from 'react';
import { DragDropProvider } from './DragDropContext';
import { Draggable } from './Draggable';
import { DropZone } from './DropZone';
import type { DropResult } from './types';
import styles from '@larose-ui/styles/components/DragDrop/DragDrop.module.css';

export interface DragDropListItem {
  id: string;
  label: string;
  type?: string;
}

export interface DragDropListProps {
  zoneId?: string;
  items: DragDropListItem[];
  onReorder: (items: DragDropListItem[]) => void;
  renderItem?: (item: DragDropListItem) => ReactNode;
}

function DragDropListInner({
  zoneId = 'list',
  items,
  onReorder,
  renderItem,
}: DragDropListProps) {
  const [transferring, setTransferring] = useState(false);

  const handleDrop = useCallback(
    async (result: DropResult<DragDropListItem>) => {
      if (result.destinationId !== zoneId || result.operation !== 'move') return;
      const dragged = result.items[0]?.data;
      if (!dragged) return;

      setTransferring(true);
      await new Promise((resolve) => window.setTimeout(resolve, 400));

      const fromIndex = items.findIndex((item) => item.id === dragged.id);
      if (fromIndex < 0) {
        setTransferring(false);
        return;
      }

      const next = [...items];
      const [removed] = next.splice(fromIndex, 1);
      next.push(removed!);
      onReorder(next);
      setTransferring(false);
    },
    [items, onReorder, zoneId],
  );

  return (
    <DropZone
      id={zoneId}
      accepts="list-item"
      onDrop={handleDrop}
      transferring={transferring}
      transferringLabel="Moving item…"
    >
      <ul className={styles.list} role="list">
        {items.map((item) => (
          <li key={item.id}>
            <Draggable
              id={item.id}
              sourceId={zoneId}
              data={item}
              type="list-item"
              label={item.label}
              preview={item.label}
            >
              <div className={styles.listItem}>
                <span className={styles.listItemHandle} aria-hidden="true">
                  ⠿
                </span>
                <span className={styles.listItemLabel}>
                  {renderItem ? renderItem(item) : item.label}
                </span>
              </div>
            </Draggable>
          </li>
        ))}
      </ul>
    </DropZone>
  );
}

/** Reorderable list with Apple HIG drag feedback (same-container move). */
export function DragDropList(props: DragDropListProps) {
  return (
    <DragDropProvider>
      <DragDropListInner {...props} />
    </DragDropProvider>
  );
}
