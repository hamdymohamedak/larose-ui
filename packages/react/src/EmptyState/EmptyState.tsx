import type { CSSProperties, ReactNode } from 'react';
import type { UIState } from '@larose-ui/core';
import { Button } from '../Button/Button';
import styles from '@larose-ui/styles/components/EmptyState/EmptyState.module.css';

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  state?: UIState;
  className?: string;
  style?: CSSProperties;
}

export function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  state = 'empty',
  className,
  style,
}: EmptyStateProps) {
  return (
    <div
      className={[styles.empty, className].filter(Boolean).join(' ')}
      style={style}
      data-state={state}
      role="status"
    >
      {icon && <div className={styles.icon}>{icon}</div>}
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
      {actionLabel && onAction && (
        <div className={styles.action}>
          <Button variant="primary" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
