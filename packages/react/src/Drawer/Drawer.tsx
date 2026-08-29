import {
  useEffect,
  useRef,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import styles from './Drawer.module.css';

export type DrawerSide = 'left' | 'right';

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  description?: string;
  side?: DrawerSide;
  closeOnOverlay?: boolean;
}

export function Drawer({
  open,
  onClose,
  children,
  title,
  description,
  side = 'right',
  closeOnOverlay = true,
}: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    previousFocus.current = document.activeElement as HTMLElement;
    panelRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
      previousFocus.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleOverlayClick = (e: MouseEvent) => {
    if (closeOnOverlay && e.target === e.currentTarget) onClose();
  };

  return createPortal(
    <div className={styles.overlay} onClick={handleOverlayClick} role="presentation">
      <aside
        ref={panelRef}
        className={styles.panel}
        data-side={side}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'lr-drawer-title' : undefined}
        aria-describedby={description ? 'lr-drawer-desc' : undefined}
        tabIndex={-1}
      >
        {title && (
          <h2 id="lr-drawer-title" className={styles.title}>
            {title}
          </h2>
        )}
        {description && (
          <p id="lr-drawer-desc" className={styles.description}>
            {description}
          </p>
        )}
        <div className={styles.content}>{children}</div>
      </aside>
    </div>,
    document.body,
  );
}
