import {
  useEffect,
  useRef,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { usePresence } from '../Motion/usePresence';
import motionStyles from '../Motion/motion.module.css';
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
  const { phase, shouldRender, onAnimationEnd } = usePresence({ present: open });

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

  if (!shouldRender) return null;

  const handleOverlayClick = (e: MouseEvent) => {
    if (closeOnOverlay && e.target === e.currentTarget) onClose();
  };

  const backdropClass = [
    styles.overlay,
    phase === 'entering' || phase === 'exiting'
      ? motionStyles[`backdrop-${phase}` as keyof typeof motionStyles]
      : undefined,
  ]
    .filter(Boolean)
    .join(' ');

  const drawerVariant = side === 'right' ? 'drawer-right' : 'drawer-left';
  const panelClass = [
    styles.panel,
    phase === 'entering' || phase === 'exiting'
      ? motionStyles[`${drawerVariant}-${phase}` as keyof typeof motionStyles]
      : undefined,
  ]
    .filter(Boolean)
    .join(' ');

  return createPortal(
    <div
      className={backdropClass}
      onClick={handleOverlayClick}
      role="presentation"
      data-presence={phase}
      onAnimationEnd={onAnimationEnd}
    >
      <aside
        ref={panelRef}
        className={panelClass}
        data-side={side}
        data-presence={phase}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'lr-drawer-title' : undefined}
        aria-describedby={description ? 'lr-drawer-desc' : undefined}
        tabIndex={-1}
        onAnimationEnd={onAnimationEnd}
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
