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
import { activateOverlayFocus } from '@larose-ui/primitives';
import {
  MODAL_ARIA_IDS,
  presenceMotionClassKey,
  shouldDismissOnOverlayClick,
} from '@larose-ui/component-logic/overlay';
import { getLaRosePortalTarget } from '@larose-ui/core';
import { useComponentDefaults } from '../theme/useComponentDefaults';
import { useComponentMotion } from '../theme/useComponentMotion';
import { useSharedPresence } from '../Motion/useSharedPresence';
import motionStyles from '@larose-ui/styles/components/Motion/motion.module.css';
import styles from '@larose-ui/styles/components/Modal/Modal.module.css';

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
  const { phase, shouldRender, onAnimationEnd } = useSharedPresence(open);
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
    if (
      shouldDismissOnOverlayClick({
        closeOnOverlay,
        eventTarget: e.target,
        currentTarget: e.currentTarget,
      })
    ) {
      onClose();
    }
  };

  const backdropKey = presenceMotionClassKey('backdrop', phase);
  const modalKey = presenceMotionClassKey('modal', phase);

  const backdropClass = [
    styles.overlay,
    overlayClassName,
    backdropKey ? motionStyles[backdropKey as keyof typeof motionStyles] : undefined,
  ]
    .filter(Boolean)
    .join(' ');

  const modalClass = [
    styles.modal,
    contentClassName,
    className,
    modalKey ? motionStyles[modalKey as keyof typeof motionStyles] : undefined,
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
      <div
        ref={dialogRef}
        className={modalClass}
        style={{ ...motionStyle, ...contentStyle }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? MODAL_ARIA_IDS.titleId : undefined}
        aria-describedby={description ? MODAL_ARIA_IDS.descriptionId : undefined}
        data-presence={phase}
        onAnimationEnd={onAnimationEnd}
      >
        {title && (
          <h2 id={MODAL_ARIA_IDS.titleId} className={styles.title}>
            {title}
          </h2>
        )}
        {description && (
          <p id={MODAL_ARIA_IDS.descriptionId} className={styles.description}>
            {description}
          </p>
        )}
        <div className={styles.content}>{children}</div>
      </div>
    </div>,
    getLaRosePortalTarget(),
  );
}
