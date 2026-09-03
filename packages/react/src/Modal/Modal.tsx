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
import {
  activateOverlayFocus,
} from '@larose-ui/primitives';
import { useComponentDefaults } from '../theme/useComponentDefaults';
import { useComponentMotion } from '../theme/useComponentMotion';
import { usePresence } from '../Motion/usePresence';
import motionStyles from '@larose-ui/styles/components/Motion/motion.module.css';
import styles from '@larose-ui/styles/components/Modal/Modal.module.css';
import { getLaRosePortalTarget } from '@larose-ui/core';

export interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  description?: string;
  closeOnOverlay?: boolean;
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
  style?: CSSProperties;
  overlayStyle?: CSSProperties;
  contentStyle?: CSSProperties;
  motion?: ComponentMotionOverride;
}

export function Modal(incomingProps: ModalProps) {
  const {
    open,
    onClose,
    children,
    title,
    description,
    closeOnOverlay = true,
    className,
    overlayClassName,
    contentClassName,
    style,
    overlayStyle,
    contentStyle,
    motion,
    ...props
  } = useComponentDefaults('Modal', incomingProps);

  const dialogRef = useRef<HTMLDivElement>(null);
  const { phase, shouldRender, onAnimationEnd } = usePresence({ present: open });
  const { style: motionStyle } = useComponentMotion('Modal', motion);

  useEffect(() => {
    if (!open) return;
    return activateOverlayFocus({
      container: dialogRef.current,
      onEscape: onClose,
    });
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

  const modalClass = [
    styles.modal,
    contentClassName,
    className,
    phase === 'entering' || phase === 'exiting'
      ? motionStyles[`modal-${phase}` as keyof typeof motionStyles]
      : undefined,
  ]
    .filter(Boolean)
    .join(' ');

  return createPortal(<div
      className={backdropClass}
      style={{ ...motionStyle, ...overlayStyle, ...style }}
      onClick={handleOverlayClick}
      role="presentation"
      data-presence={phase}
      onAnimationEnd={onAnimationEnd}
      {...props}
    >
      <div
        ref={dialogRef}
        className={modalClass}
        style={{ ...motionStyle, ...contentStyle }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'lr-modal-title' : undefined}
        aria-describedby={description ? 'lr-modal-desc' : undefined}
        data-presence={phase}
        onAnimationEnd={onAnimationEnd}
      >
        {title && (
          <h2 id="lr-modal-title" className={styles.title}>
            {title}
          </h2>
        )}
        {description && (
          <p id="lr-modal-desc" className={styles.description}>
            {description}
          </p>
        )}
        <div className={styles.content}>{children}</div>
      </div>
    </div>,
    getLaRosePortalTarget(),
  );
}
