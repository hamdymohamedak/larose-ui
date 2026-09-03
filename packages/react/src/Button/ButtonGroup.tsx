import type { CSSProperties, ReactNode } from 'react';
import styles from '@larose-ui/styles/components/Button/Button.module.css';

export interface ButtonGroupProps {
  children: ReactNode;
  /** Horizontal row (default) or vertical stack for visionOS guidance. */
  orientation?: 'horizontal' | 'vertical';
  /** Full-width buttons for watchOS-style primary actions. */
  fullWidth?: boolean;
  className?: string;
  style?: CSSProperties;
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
  style,
  'aria-label': ariaLabel,
}: ButtonGroupProps) {
  return (
    <div
      className={[styles.group, className].filter(Boolean).join(' ')}
      style={style}
      data-orientation={orientation}
      data-full-width={fullWidth ? 'true' : undefined}
      role="group"
      aria-label={ariaLabel}
    >
      {children}
    </div>
  );
}
