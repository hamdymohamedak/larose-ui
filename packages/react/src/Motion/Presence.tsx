import {
  cloneElement,
  isValidElement,
  useEffect,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from 'react';
import type { MotionVariant } from './types';
import { usePresence } from './usePresence';
import { useSkipMotion } from './MotionContext';
import styles from '@larose-ui/styles/components/Motion/motion.module.css';

export interface PresenceProps {
  present: boolean;
  children: ReactNode;
  variant?: MotionVariant;
  /** Placement hint for spatial variants (toast, popover). */
  placement?: string;
  className?: string;
  style?: CSSProperties;
  onExitComplete?: () => void;
  /** When true, skip exit animation and unmount immediately. */
  immediate?: boolean;
}

function mergeClassName(...parts: Array<string | undefined>): string | undefined {
  const merged = parts.filter(Boolean).join(' ');
  return merged || undefined;
}

/**
 * Keeps children mounted during exit animations and applies motion CSS classes.
 * Pass a single React element child to merge props onto it.
 */
export function Presence({
  present,
  children,
  variant = 'fade',
  placement,
  className,
  style,
  onExitComplete,
  immediate = false,
}: PresenceProps) {
  const skipMotion = useSkipMotion();
  const effectivePresent = immediate ? false : present;
  const { phase, shouldRender, onAnimationEnd } = usePresence({
    present: effectivePresent,
    onExitComplete,
  });

  useEffect(() => {
    if (immediate && onExitComplete) {
      onExitComplete();
    }
  }, [immediate, onExitComplete]);

  if (!shouldRender && !immediate) return null;
  if (immediate) return null;

  const motionClass = skipMotion
    ? undefined
    : styles[`${variant}-${phase}` as keyof typeof styles];

  const dataAttrs = {
    'data-presence': phase,
    'data-motion-variant': variant,
    ...(placement ? { 'data-placement': placement } : {}),
  };

  if (isValidElement(children)) {
    const child = children as ReactElement<{
      className?: string;
      style?: CSSProperties;
      onAnimationEnd?: (e: React.AnimationEvent) => void;
    }>;

    return cloneElement(child, {
      ...dataAttrs,
      className: mergeClassName(child.props.className, motionClass, className),
      style: { ...child.props.style, ...style },
      onAnimationEnd: (e: React.AnimationEvent) => {
        child.props.onAnimationEnd?.(e);
        onAnimationEnd(e);
      },
    });
  }

  return (
    <div
      {...dataAttrs}
      className={mergeClassName(motionClass, className)}
      style={style}
      onAnimationEnd={onAnimationEnd}
    >
      {children}
    </div>
  );
}
