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
  focusFirst,
} from '@larose-ui/primitives';
import {
  presenceMotionClassKey,
  shouldDismissOnOverlayClick,
} from '@larose-ui/component-logic/overlay';
import { getLaRosePortalTarget } from '@larose-ui/core';
import { useComponentDefaults } from '../theme/useComponentDefaults';
import { useComponentMotion } from '../theme/useComponentMotion';
import { useSharedPresence } from '../Motion/useSharedPresence';
import motionStyles from '@larose-ui/styles/components/Motion/motion.module.css';
import styles from '@larose-ui/styles/components/Drawer/Drawer.module.css';

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
  const { phase, shouldRender, onAnimationEnd } = useSharedPresence(open);
  const { style: motionStyle } = useComponentMotion('Drawer', motion);


  useEffect(() => {
    if (!open) return;
    if (!focusFirst(panelRef.current)) {
      panelRef.current?.focus();
    }
    return activateOverlayFocus({
      container: panelRef.current,
      onEscape: onClose,
      autoFocus: false,
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
  const drawerVariant = side === 'right' ? 'drawer-right' : 'drawer-left';
  const panelKey = presenceMotionClassKey(drawerVariant, phase);

  const backdropClass = [
    styles.overlay,
    overlayClassName,
    backdropKey ? motionStyles[backdropKey as keyof typeof motionStyles] : undefined,
  ]
    .filter(Boolean)
    .join(' ');

  const panelClass = [
    styles.panel,
    panelClassName,
    className,
    panelKey ? motionStyles[panelKey as keyof typeof motionStyles] : undefined,
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
    getLaRosePortalTarget(),
  );
}
