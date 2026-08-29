import { forwardRef, type SelectHTMLAttributes } from 'react';
import type { Size, UIState } from '@larose-ui/core';
import { resolveUIState } from '@larose-ui/core';
import styles from './Select.module.css';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
  state?: UIState;
  loading?: boolean;
  error?: string | null;
  inputSize?: Size;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      hint,
      options,
      placeholder = 'Select...',
      state,
      loading = false,
      error = null,
      disabled,
      inputSize = 'md',
      className,
      id,
      ...props
    },
    ref,
  ) => {
    const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const uiState = resolveUIState({ state, loading, error, disabled });
    const errorMessage = typeof error === 'string' ? error : null;

    return (
      <div className={styles.wrapper} data-state={uiState}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
          </label>
        )}
        <div className={styles.inputContainer}>
          <select
            ref={ref}
            id={inputId}
            className={[styles.select, className].filter(Boolean).join(' ')}
            data-size={inputSize}
            data-state={uiState}
            disabled={disabled || uiState === 'disabled' || uiState === 'loading'}
            aria-invalid={uiState === 'error'}
            aria-busy={uiState === 'loading'}
            aria-describedby={
              errorMessage ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
            }
            {...props}
          >
            <option value="">{placeholder}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
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

Select.displayName = 'Select';
