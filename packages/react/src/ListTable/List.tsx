import type { ReactNode } from 'react';
import type { ListVariant } from './types';
import styles from './ListTable.module.css';

export interface ListProps {
  variant?: ListVariant;
  children: ReactNode;
  className?: string;
  'aria-label'?: string;
}

export function List({
  variant = 'grouped',
  children,
  className,
  'aria-label': ariaLabel,
}: ListProps) {
  return (
    <div
      className={[styles.list, className].filter(Boolean).join(' ')}
      data-variant={variant}
      role="list"
      aria-label={ariaLabel}
    >
      {children}
    </div>
  );
}
