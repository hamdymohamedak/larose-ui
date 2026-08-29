import type { ReactNode } from 'react';
import type { UIState } from '@larose-ui/core';
import { Button } from '../Button/Button';
import styles from './EmptyState.module.css';

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  state?: UIState;
}

export function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  state = 'empty',
}: EmptyStateProps) {
  return (
    <div className={styles.empty} data-state={state} role="status">
      {icon && <div className={styles.icon}>{icon}</div>}
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
