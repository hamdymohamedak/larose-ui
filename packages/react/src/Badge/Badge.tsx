import type { ReactNode } from 'react';
import styles from '@larose-ui/styles/components/Badge/Badge.module.css';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

export interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
}

export function Badge({ variant = 'default', children }: BadgeProps) {
  return (
    <span className={styles.badge} data-variant={variant}>
      {children}
    </span>
  );
}
