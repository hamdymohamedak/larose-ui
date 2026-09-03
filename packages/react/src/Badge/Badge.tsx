import type { CSSProperties, ReactNode } from 'react';
import styles from '@larose-ui/styles/components/Badge/Badge.module.css';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

export interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function Badge({ variant = 'default', children, className, style }: BadgeProps) {
  return (
    <span
      className={[styles.badge, className].filter(Boolean).join(' ')}
      style={style}
      data-variant={variant}
    >
      {children}
    </span>
  );
}
