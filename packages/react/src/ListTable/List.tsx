import type { CSSProperties, ReactNode } from 'react';
import type { ListVariant } from './types';
import styles from '@larose-ui/styles/components/ListTable/ListTable.module.css';

export interface ListProps {
  variant?: ListVariant;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  'aria-label'?: string;
}

export function List({
  variant = 'grouped',
  children,
  className,
  style,
  'aria-label': ariaLabel,
}: ListProps) {
  return (
    <div
      className={[styles.list, className].filter(Boolean).join(' ')}
      style={style}
      data-variant={variant}
      role="list"
      aria-label={ariaLabel}
    >
      {children}
    </div>
  );
}
