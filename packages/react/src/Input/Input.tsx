import { forwardRef, type InputHTMLAttributes } from 'react';
import type { Size, UIState } from '@larose/core';
import { resolveUIState } from '@larose/core';
import styles from './Input.module.css';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  state?: UIState;
  loading?: boolean;
  error?: string | null;
  inputSize?: Size;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      hint,
      state,
      loading = false,
      error = null,
      disabled,
      readOnly,
      inputSize = 'md',
      className,
      id,
      ...props
    },
    ref,
  ) => {
    const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const uiState = resolveUIState({ state, loading, error, disabled, readonly: readOnly });
    const errorMessage = typeof error === 'string' ? error : null;

    return (
      <div className={styles.wrapper} data-state={uiState}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
          </label>
        )}
        <div className={styles.inputContainer}>
          <input
            ref={ref}
            id={inputId}
            className={[styles.input, className].filter(Boolean).join(' ')}
            data-size={inputSize}
            data-state={uiState}
            disabled={disabled || uiState === 'disabled'}
            readOnly={readOnly || uiState === 'readonly'}
            aria-invalid={uiState === 'error'}
            aria-busy={uiState === 'loading'}
            aria-describedby={
              errorMessage ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
            }
            {...props}
          />
          {uiState === 'loading' && (
            <span className={styles.loadingIndicator} aria-hidden="true" />
          )}
        </div>
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

Input.displayName = 'Input';
