import { createPortal } from 'react-dom';
import type { DragSession } from './types';
import styles from '@larose-ui/styles/components/DragDrop/DragDrop.module.css';

export function DragPreviewLayer({
  session,
  revert,
}: {
  session: DragSession | null;
  revert: boolean;
}) {
  if (!session) return null;

  const primary = session.items[0];
  const count = session.items.length;

  return createPortal(
    <div className={styles.previewLayer} aria-hidden="true">
      <div
        className={styles.preview}
        data-revert={revert ? 'true' : undefined}
        style={{
          left: session.x,
          top: session.y,
          transform: revert
            ? `translate(-50%, -50%) scale(0.85)`
            : 'translate(-50%, -50%)',
        }}
      >
        {primary?.preview ?? primary?.label ?? 'Dragging…'}
        {count > 1 && <span className={styles.badge}>{count}</span>}
      </div>
    </div>,
    document.body,
  );
}
