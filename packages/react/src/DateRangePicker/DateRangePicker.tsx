import { useId } from 'react';
import type { Size, UIState } from '@larose/core';
import { resolveUIState } from '@larose/core';
import styles from '../DatePicker/datetime-field.module.css';

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface DateRangePickerProps {
  label?: string;
  startLabel?: string;
  endLabel?: string;
  hint?: string;
  state?: UIState;
  loading?: boolean;
  error?: string | null;
  inputSize?: Size;
  value?: DateRange;
  onChange?: (value: DateRange) => void;
  min?: string;
  max?: string;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  id?: string;
}

export function DateRangePicker({
  label,
  startLabel = 'Start date',
  endLabel = 'End date',
  hint,
  state,
  loading = false,
  error = null,
  inputSize = 'md',
  value = { startDate: '', endDate: '' },
  onChange,
  min,
  max,
  disabled,
  readOnly,
  className,
  id,
}: DateRangePickerProps) {
  const generatedId = useId();
  const groupId = id ?? generatedId;
  const startId = `${groupId}-start`;
  const endId = `${groupId}-end`;
  const uiState = resolveUIState({ state, loading, error, disabled, readonly: readOnly });
  const errorMessage = typeof error === 'string' ? error : null;

  const updateRange = (partial: Partial<DateRange>) => {
    onChange?.({ ...value, ...partial });
  };

  return (
    <fieldset
      className={[styles.wrapper, className].filter(Boolean).join(' ')}
      data-state={uiState}
      aria-describedby={
        errorMessage ? `${groupId}-error` : hint ? `${groupId}-hint` : undefined
      }
    >
      {label && (
        <legend className={styles.label} id={`${groupId}-legend`}>
          {label}
        </legend>
      )}
      <div className={styles.range}>
        <div className={styles.rangeField}>
          <label htmlFor={startId} className={styles.label}>
            {startLabel}
          </label>
          <div className={styles.inputContainer}>
            <input
              id={startId}
              type="date"
              className={styles.input}
              data-size={inputSize}
              data-state={uiState}
              value={value.startDate}
              min={min}
              max={value.endDate || max}
              disabled={disabled || uiState === 'disabled' || uiState === 'loading'}
              readOnly={readOnly || uiState === 'readonly'}
              aria-invalid={uiState === 'error'}
              aria-busy={uiState === 'loading'}
              onChange={(event) => updateRange({ startDate: event.target.value })}
            />
          </div>
        </div>
        <span className={styles.separator} aria-hidden="true">
          to
        </span>
        <div className={styles.rangeField}>
          <label htmlFor={endId} className={styles.label}>
            {endLabel}
          </label>
          <div className={styles.inputContainer}>
            <input
              id={endId}
              type="date"
              className={styles.input}
              data-size={inputSize}
              data-state={uiState}
              value={value.endDate}
              min={value.startDate || min}
              max={max}
              disabled={disabled || uiState === 'disabled' || uiState === 'loading'}
              readOnly={readOnly || uiState === 'readonly'}
              aria-invalid={uiState === 'error'}
              aria-busy={uiState === 'loading'}
              onChange={(event) => updateRange({ endDate: event.target.value })}
            />
          </div>
        </div>
      </div>
      {hint && !errorMessage && (
        <span id={`${groupId}-hint`} className={styles.hint}>
          {hint}
        </span>
      )}
      {errorMessage && (
        <span id={`${groupId}-error`} className={styles.error} role="alert">
          {errorMessage}
        </span>
      )}
    </fieldset>
  );
}
