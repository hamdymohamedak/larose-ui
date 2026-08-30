import { createPortal } from 'react-dom';
import type { CSSProperties, ReactNode } from 'react';
import { usePresence } from './usePresence';
import motionStyles from './motion.module.css';

export type OverlayPlacement = 'top' | 'bottom';

function backdropClass(phase: string): string | undefined {
  if (phase !== 'entering' && phase !== 'exiting') return undefined;
  return motionStyles[`backdrop-${phase}` as keyof typeof motionStyles];
}

function menuClass(placement: OverlayPlacement, phase: string): string | undefined {
  if (phase !== 'entering' && phase !== 'exiting') return undefined;
  return motionStyles[`menu-${placement}-${phase}` as keyof typeof motionStyles];
}

export interface ContextualMenuPortalProps {
  open: boolean;
  onClose?: () => void;
  placement?: OverlayPlacement;
  backdropClassName?: string;
  showBackdrop?: boolean;
  surfaceClassName?: string;
  surfaceStyle?: CSSProperties;
  surfaceId?: string;
  surfaceRole?: string;
  'aria-label'?: string;
  'data-placement'?: string;
  onSurfaceClick?: (event: React.MouseEvent) => void;
  children: ReactNode;
}

/**
 * Single presence controller for contextual menus (dock, edit, context, quick actions).
 * Backdrop and surface share one lifecycle so exit animations complete before unmount.
 */
export function ContextualMenuPortal({
  open,
  onClose,
  placement = 'bottom',
  backdropClassName,
  showBackdrop = true,
  surfaceClassName,
  surfaceStyle,
  surfaceId,
  surfaceRole,
  'aria-label': ariaLabel,
  'data-placement': dataPlacement,
  onSurfaceClick,
  children,
}: ContextualMenuPortalProps) {
  const { phase, shouldRender, onAnimationEnd } = usePresence({ present: open });

  if (!shouldRender) return null;

  const surfaceMotionStyle: CSSProperties = {
    ...surfaceStyle,
    ...(phase === 'mounting' ? { opacity: 0, pointerEvents: 'none' as const } : undefined),
  };

  return createPortal(
    <>
      {showBackdrop && (
        <div
          className={[backdropClassName, backdropClass(phase)].filter(Boolean).join(' ')}
          role="presentation"
          onClick={onClose}
          data-presence={phase}
          onAnimationEnd={onAnimationEnd}
        />
      )}
      <div
        id={surfaceId}
        role={surfaceRole}
        aria-label={ariaLabel}
        className={[surfaceClassName, menuClass(placement, phase)].filter(Boolean).join(' ')}
        style={surfaceMotionStyle}
        data-presence={phase}
        data-side={placement}
        data-placement={dataPlacement}
        onAnimationEnd={onAnimationEnd}
        onClick={onSurfaceClick}
      >
        {children}
      </div>
    </>,
    document.body,
  );
}

export interface OverlayBackdropProps {
  open: boolean;
  className?: string;
  onClose?: () => void;
}

/** @deprecated Prefer ContextualMenuPortal for menus with a shared lifecycle. */
export function OverlayBackdrop({ open, className, onClose }: OverlayBackdropProps) {
  const { phase, shouldRender } = usePresence({ present: open });
  if (!shouldRender) return null;

  return (
    <div
      className={[className, backdropClass(phase)].filter(Boolean).join(' ')}
      role="presentation"
      onClick={onClose}
      data-presence={phase}
    />
  );
}

export interface AnimatedOverlaySurfaceProps {
  present: boolean;
  placement?: OverlayPlacement;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  id?: string;
  role?: string;
  'aria-label'?: string;
  'data-placement'?: string;
  onClick?: (event: React.MouseEvent) => void;
}

/** @deprecated Prefer ContextualMenuPortal for fixed menus. */
export function AnimatedOverlaySurface({
  present,
  placement = 'bottom',
  className,
  style,
  children,
  id,
  role,
  'aria-label': ariaLabel,
  'data-placement': dataPlacement,
  onClick,
}: AnimatedOverlaySurfaceProps) {
  const { phase, shouldRender, onAnimationEnd } = usePresence({ present });

  if (!shouldRender) return null;

  return (
    <div
      id={id}
      role={role}
      aria-label={ariaLabel}
      className={[className, menuClass(placement, phase)].filter(Boolean).join(' ')}
      style={style}
      data-presence={phase}
      data-side={placement}
      data-placement={dataPlacement}
      onAnimationEnd={onAnimationEnd}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export interface OverlayPortalProps {
  open: boolean;
  onClose: () => void;
  placement?: OverlayPlacement;
  backdropClassName?: string;
  children: ReactNode;
}

/** @deprecated Prefer ContextualMenuPortal. */
export function OverlayPortal({
  open,
  onClose,
  placement = 'bottom',
  backdropClassName,
  children,
}: OverlayPortalProps) {
  return (
    <ContextualMenuPortal
      open={open}
      onClose={onClose}
      placement={placement}
      backdropClassName={backdropClassName}
      surfaceStyle={{ display: 'contents' }}
    >
      {children}
    </ContextualMenuPortal>
  );
}
