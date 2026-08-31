import {
  useEffect,
  useRef,
  type CSSProperties,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import type { ComponentMotionOverride } from '@larose-ui/themes';
import { useComponentDefaults } from '../theme/useComponentDefaults';
import { useComponentMotion } from '../theme/useComponentMotion';
import { usePresence } from '../Motion/usePresence';
import motionStyles from '../Motion/motion.module.css';
import styles from './Drawer.module.css';

export type DrawerSide = 'left' | 'right';

export interface DrawerProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  description?: string;
  side?: DrawerSide;
  closeOnOverlay?: boolean;
  className?: string;
  overlayClassName?: string;
  panelClassName?: string;
  style?: CSSProperties;
  overlayStyle?: CSSProperties;
  panelStyle?: CSSProperties;
  motion?: ComponentMotionOverride;
}

export function Drawer(incomingProps: DrawerProps) {
  const {
    open,
    onClose,
    children,
    title,
    description,
    side = 'right',
    closeOnOverlay = true,
    className,
    overlayClassName,
    panelClassName,
    style,
    overlayStyle,
    panelStyle,
    motion,
    ...props
  } = useComponentDefaults('Drawer', incomingProps);

  const panelRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const { phase, shouldRender, onAnimationEnd } = usePresence({ present: open });
  const { style: motionStyle } = useComponentMotion('Drawer', motion);

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
    overlayClassName,
    phase === 'entering' || phase === 'exiting'
      ? motionStyles[`backdrop-${phase}` as keyof typeof motionStyles]
      : undefined,
  ]
    .filter(Boolean)
    .join(' ');

  const drawerVariant = side === 'right' ? 'drawer-right' : 'drawer-left';
  const panelClass = [
    styles.panel,
    panelClassName,
    className,
    phase === 'entering' || phase === 'exiting'
      ? motionStyles[`${drawerVariant}-${phase}` as keyof typeof motionStyles]
      : undefined,
  ]
    .filter(Boolean)
    .join(' ');

  return createPortal(
    <div
      className={backdropClass}
      style={{ ...motionStyle, ...overlayStyle, ...style }}
      onClick={handleOverlayClick}
      role="presentation"
      data-presence={phase}
      onAnimationEnd={onAnimationEnd}
      {...props}
    >
      <aside
        ref={panelRef}
        className={panelClass}
        style={{ ...motionStyle, ...panelStyle }}
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
