import { forwardRef, type TextareaHTMLAttributes } from 'react';
import type { Size, UIState } from '@larose-ui/core';
import { resolveUIState } from '@larose-ui/core';
import { FieldShell } from '../DataEntry/FieldShell';
import { fieldIdFromLabel } from '../DataEntry/utils';
import styles from '@larose-ui/styles/components/Textarea/Textarea.module.css';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  state?: UIState;
  loading?: boolean;
  error?: string | null;
  inputSize?: Size;
  required?: boolean;
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
      required = false,
      inputSize = 'md',
      className,
      id,
      rows = 4,
      ...props
    },
    ref,
  ) => {
    const inputId = id ?? (label ? fieldIdFromLabel(label) : undefined);
    const uiState = resolveUIState({ state, loading, error, disabled, readonly: readOnly });
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
          <textarea
            ref={ref}
            id={inputId}
            rows={rows}
            className={[styles.textarea, className].filter(Boolean).join(' ')}
            data-size={inputSize}
            data-state={uiState}
            disabled={disabled || uiState === 'disabled'}
            readOnly={readOnly || uiState === 'readonly'}
            required={required}
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
      </FieldShell>
    );
  },
);

Textarea.displayName = 'Textarea';
