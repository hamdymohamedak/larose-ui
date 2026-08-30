import { forwardRef, type SelectHTMLAttributes } from 'react';
import type { Size, UIState } from '@larose-ui/core';
import { resolveUIState } from '@larose-ui/core';
import { FieldShell } from '../DataEntry/FieldShell';
import { Spinner } from '../Spinner/Spinner';
import { fieldIdFromLabel } from '../DataEntry/utils';
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
  required?: boolean;
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
      required = false,
      inputSize = 'md',
      className,
      id,
      ...props
    },
    ref,
  ) => {
    const inputId = id ?? (label ? fieldIdFromLabel(label) : undefined);
    const uiState = resolveUIState({ state, loading, error, disabled });
    const errorMessage = typeof error === 'string' ? error : null;

    return (
      <FieldShell
        label={label}
        hint={hint}
        error={errorMessage}
        required={required}
        htmlFor={inputId}
        uiState={uiState}
      >
        <div className={styles.inputContainer}>
          <select
            ref={ref}
            id={inputId}
            className={[styles.select, className].filter(Boolean).join(' ')}
            data-size={inputSize}
            data-state={uiState}
            disabled={disabled || uiState === 'disabled' || uiState === 'loading'}
            required={required}
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
            <span className={styles.loadingIndicator} aria-hidden="true">
              <Spinner size="sm" />
            </span>
          )}
        </div>
      </FieldShell>
    );
  },
);

Select.displayName = 'Select';
