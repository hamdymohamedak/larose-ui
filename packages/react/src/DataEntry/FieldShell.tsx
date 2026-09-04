import type { CSSProperties, ReactNode } from 'react';
import type { UIState } from '@larose-ui/core';
import styles from '@larose-ui/styles/components/DataEntry/FieldShell.module.css';

export interface FieldShellProps {
  label?: string;
  hint?: string;
  error?: string | null;
  required?: boolean;
  htmlFor?: string;
  uiState?: UIState;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function FieldShell({
  label,
  hint,
  error = null,
  required = false,
  htmlFor,
  uiState = 'idle',
  children,
  className,
  style,
}: FieldShellProps) {
  const errorMessage = typeof error === 'string' ? error : null;

  return (
    <div
      className={[styles.wrapper, className].filter(Boolean).join(' ')}
      style={style}
      data-state={uiState}
    >
      {label && (
        <label htmlFor={htmlFor} className={styles.label}>
          {label}
          {required && (
            <>
              <span className={styles.required} aria-hidden="true">
                *
              </span>
              <span className={styles.srOnly}>(required)</span>
            </>
          )}
        </label>
      )}
      {children}
      {hint && !errorMessage && (
        <span id={htmlFor ? `${htmlFor}-hint` : undefined} className={styles.hint}>
          {hint}
        </span>
      )}
      {errorMessage && (
        <span id={htmlFor ? `${htmlFor}-error` : undefined} className={styles.error} role="alert">
          {errorMessage}
        </span>
      )}
    </div>
  );
}
