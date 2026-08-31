import { forwardRef, type InputHTMLAttributes } from 'react';
import type { Size, UIState } from '@larose-ui/core';
import { resolveUIState } from '@larose-ui/core';
import styles from '@larose-ui/styles/components/DatePicker/datetime-field.module.css';

export interface TimePickerProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> {
  label?: string;
  hint?: string;
  state?: UIState;
  loading?: boolean;
  error?: string | null;
  inputSize?: Size;
  value?: string;
  onChange?: (value: string) => void;
}

export const TimePicker = forwardRef<HTMLInputElement, TimePickerProps>(
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
      value = '',
      onChange,
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
            type="time"
            className={[styles.input, className].filter(Boolean).join(' ')}
            data-size={inputSize}
            data-state={uiState}
            value={value}
            disabled={disabled || uiState === 'disabled' || uiState === 'loading'}
            readOnly={readOnly || uiState === 'readonly'}
            aria-invalid={uiState === 'error'}
            aria-busy={uiState === 'loading'}
            aria-describedby={
              errorMessage ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
            }
            onChange={(event) => onChange?.(event.target.value)}
            {...props}
          />
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

TimePicker.displayName = 'TimePicker';
