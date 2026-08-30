import type { ReactNode } from 'react';
import styles from './Button.module.css';

export interface ButtonGroupProps {
  children: ReactNode;
  /** Horizontal row (default) or vertical stack for visionOS guidance. */
  orientation?: 'horizontal' | 'vertical';
  /** Full-width buttons for watchOS-style primary actions. */
  fullWidth?: boolean;
  className?: string;
  'aria-label'?: string;
}

/**
 * Same-size button set — use style, not size, to distinguish the preferred option.
 */
export function ButtonGroup({
  children,
  orientation = 'horizontal',
  fullWidth = false,
  className,
  'aria-label': ariaLabel,
}: ButtonGroupProps) {
  return (
    <div
      className={[styles.group, className].filter(Boolean).join(' ')}
      data-orientation={orientation}
      data-full-width={fullWidth ? 'true' : undefined}
      role="group"
      aria-label={ariaLabel}
    >
      {children}
    </div>
  );
}
