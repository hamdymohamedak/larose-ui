import { forwardRef, type InputHTMLAttributes } from 'react';
import type { Size } from '@larose-ui/core';
import styles from '@larose-ui/styles/components/Checkbox/Checkbox.module.css';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label: string;
  hint?: string;
  error?: string | null;
  boxSize?: Size;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    { label, hint, error = null, disabled, boxSize = 'md', className, style, id, ...props },
    ref,
  ) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');
    const errorMessage = typeof error === 'string' ? error : null;

    return (
      <div className={styles.wrapper} style={style} data-state={errorMessage ? 'error' : 'default'}>
        <label htmlFor={inputId} className={styles.row}>
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            className={[styles.input, className].filter(Boolean).join(' ')}
            data-size={boxSize}
            disabled={disabled}
            aria-invalid={Boolean(errorMessage)}
            aria-describedby={
              errorMessage ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
            }
            {...props}
          />
          <span className={styles.label}>{label}</span>
        </label>
        {hint && !errorMessage && (
          <span id={`${inputId}-hint`} className={styles.hint}>
            {hint}
          </span>
        )}
        {errorMessage && (
          <span id={`${inputId}-error`} className={styles.error} role="alert">
            {errorMessage}
          </span>
        )}
      </div>
    );
  },
);

Checkbox.displayName = 'Checkbox';
