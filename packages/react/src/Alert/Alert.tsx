import type { CSSProperties, ReactNode } from 'react';
import styles from '@larose-ui/styles/components/Alert/Alert.module.css';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: ReactNode;
  onDismiss?: () => void;
  className?: string;
  style?: CSSProperties;
}

export function Alert({
  variant = 'info',
  title,
  children,
  onDismiss,
  className,
  style,
}: AlertProps) {
  return (
    <div
      className={[styles.alert, className].filter(Boolean).join(' ')}
      style={style}
      data-variant={variant}
      role="alert"
    >
      <div className={styles.content}>
        {title && <strong className={styles.title}>{title}</strong>}
        <div className={styles.message}>{children}</div>
      </div>
      {onDismiss && (
        <button
          type="button"
          className={styles.dismiss}
          onClick={onDismiss}
          aria-label="Dismiss alert"
        >
          ×
        </button>
      )}
    </div>
  );
}
