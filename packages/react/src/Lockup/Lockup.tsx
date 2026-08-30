import type { ReactNode } from 'react';
import type { LockupAxis } from './types';
import styles from './Lockup.module.css';

export interface LockupProps {
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  axis?: LockupAxis;
  focused?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  onClick?: () => void;
  className?: string;
  'aria-label'?: string;
}

/**
 * Header + content + footer unit that expands together on focus.
 * @see https://developer.apple.com/design/human-interface-guidelines/lockups
 */
export function Lockup({
  header,
  footer,
  children,
  axis = 'horizontal',
  focused = false,
  onFocus,
  onBlur,
  onClick,
  className,
  'aria-label': ariaLabel,
}: LockupProps) {
  return (
    <button
      type="button"
      className={[styles.lockup, className].filter(Boolean).join(' ')}
      data-axis={axis}
      data-focused={focused ? 'true' : undefined}
      aria-label={ariaLabel}
      onFocus={onFocus}
      onBlur={onBlur}
      onClick={onClick}
    >
      {header && <div className={styles.header}>{header}</div>}
      <div className={styles.content}>{children}</div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </button>
  );
}
