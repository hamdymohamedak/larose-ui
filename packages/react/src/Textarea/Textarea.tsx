import { forwardRef, type TextareaHTMLAttributes } from 'react';
import type { Size, UIState } from '@larose-ui/core';
import { resolveUIState } from '@larose-ui/core';
import styles from './Textarea.module.css';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  state?: UIState;
  loading?: boolean;
  error?: string | null;
  inputSize?: Size;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
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
      rows = 4,
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
          <textarea
            ref={ref}
            id={inputId}
            rows={rows}
            className={[styles.textarea, className].filter(Boolean).join(' ')}
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

Textarea.displayName = 'Textarea';
