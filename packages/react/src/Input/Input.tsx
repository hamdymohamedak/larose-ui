import {
  forwardRef,
  useCallback,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type FocusEvent,
  type InputHTMLAttributes,
} from 'react';
import type { Size, UIState } from '@larose-ui/core';
import { resolveUIState } from '@larose-ui/core';
import { FieldShell } from '../DataEntry/FieldShell';
import { Spinner } from '../Spinner/Spinner';
import type { FieldFormat, FieldValidator, FormatFieldOptions } from '../DataEntry/utils';
import { fieldIdFromLabel, formatFieldValue } from '../DataEntry/utils';
import styles from './Input.module.css';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  state?: UIState;
  loading?: boolean;
  error?: string | null;
  inputSize?: Size;
  /** Shows a required indicator and sets the native required attribute. */
  required?: boolean;
  /** Validates on blur or change and surfaces inline feedback immediately. */
  validate?: FieldValidator;
  validateOn?: 'blur' | 'change';
  /** Formats numeric values on blur (currency, percent, number). */
  format?: FieldFormat;
  formatOptions?: FormatFieldOptions;
  /** macOS-style expansion tooltip when truncated text overflows the field. */
  expansionTooltip?: boolean;
  /** Accept plain-text drops into the field. */
  acceptDrop?: boolean;
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
      required = false,
      validate,
      validateOn = 'blur',
      format,
      formatOptions,
      expansionTooltip = false,
      acceptDrop = false,
      inputSize = 'md',
      className,
      id,
      type = 'text',
      onBlur,
      onChange,
      onFocus,
      onDrop,
      onDragOver,
      value,
      defaultValue,
      ...props
    },
    ref,
  ) => {
    const inputId = id ?? (label ? fieldIdFromLabel(label) : undefined);
    const innerRef = useRef<HTMLInputElement | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [focused, setFocused] = useState(false);
    const [expansionTitle, setExpansionTitle] = useState<string | undefined>();

    const mergedError = error ?? validationError;
    const uiState = resolveUIState({
      state,
      loading,
      error: mergedError,
      disabled,
      readonly: readOnly,
    });
    const errorMessage = typeof mergedError === 'string' ? mergedError : null;

    const setRefs = useCallback(
      (node: HTMLInputElement | null) => {
        innerRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    const runValidation = useCallback(
      (nextValue: string) => {
        if (!validate) return;
        setValidationError(validate(nextValue));
      },
      [validate],
    );

    const updateExpansionTooltip = useCallback(() => {
      if (!expansionTooltip || !innerRef.current) return;
      const input = innerRef.current;
      const overflows = input.scrollWidth > input.clientWidth;
      setExpansionTitle(overflows ? input.value : undefined);
    }, [expansionTooltip]);

    const handleFocus = useCallback(
      (event: FocusEvent<HTMLInputElement>) => {
        setFocused(true);
        onFocus?.(event);
      },
      [onFocus],
    );

    const handleBlur = useCallback(
      (event: FocusEvent<HTMLInputElement>) => {
        setFocused(false);
        if (validate && (validateOn === 'blur' || validateOn === 'change')) {
          runValidation(event.target.value);
        }
        if (format && !readOnly && type !== 'password') {
          const formatted = formatFieldValue(event.target.value, format, formatOptions);
          if (formatted !== event.target.value) {
            event.target.value = formatted;
            onChange?.({
              ...event,
              target: event.target,
              currentTarget: event.currentTarget,
            } as ChangeEvent<HTMLInputElement>);
          }
        }
        updateExpansionTooltip();
        onBlur?.(event);
      },
      [
        format,
        formatOptions,
        onBlur,
        onChange,
        readOnly,
        runValidation,
        type,
        updateExpansionTooltip,
        validate,
        validateOn,
      ],
    );

    const handleChange = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        if (validate && validateOn === 'change') {
          runValidation(event.target.value);
        }
        updateExpansionTooltip();
        onChange?.(event);
      },
      [onChange, runValidation, updateExpansionTooltip, validate, validateOn],
    );

    const handleDragOver = useCallback(
      (event: DragEvent<HTMLInputElement>) => {
        if (acceptDrop && !disabled && !readOnly) {
          event.preventDefault();
        }
        onDragOver?.(event);
      },
      [acceptDrop, disabled, onDragOver, readOnly],
    );

    const handleDrop = useCallback(
      (event: DragEvent<HTMLInputElement>) => {
        if (acceptDrop && !disabled && !readOnly) {
          event.preventDefault();
          const text = event.dataTransfer.getData('text/plain');
          if (text && innerRef.current) {
            innerRef.current.value = text;
            runValidation(text);
            onChange?.({
              ...event,
              target: innerRef.current,
              currentTarget: innerRef.current,
            } as unknown as ChangeEvent<HTMLInputElement>);
          }
        }
        onDrop?.(event);
      },
      [acceptDrop, disabled, onChange, onDrop, readOnly, runValidation],
    );

    const inputMode =
      props.inputMode ?? (format ? 'decimal' : type === 'email' ? 'email' : undefined);

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
          <div
            className={styles.inputShell}
            data-size={inputSize}
            data-state={uiState}
            data-focused={focused ? 'true' : undefined}
          >
            <input
              ref={setRefs}
              id={inputId}
              type={type}
              className={[styles.input, className].filter(Boolean).join(' ')}
              data-size={inputSize}
              data-format={format}
              disabled={disabled || uiState === 'disabled'}
              readOnly={readOnly || uiState === 'readonly'}
              required={required}
              aria-invalid={uiState === 'error'}
              aria-busy={uiState === 'loading'}
              aria-describedby={
                errorMessage ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
              }
              title={expansionTitle}
              inputMode={inputMode}
              value={value}
              defaultValue={defaultValue}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleChange}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onMouseEnter={updateExpansionTooltip}
              {...props}
            />
            {uiState === 'loading' && (
              <span className={styles.loadingIndicator} aria-hidden="true">
                <Spinner size="sm" />
              </span>
            )}
          </div>
        </div>
      </FieldShell>
    );
  },
);

Input.displayName = 'Input';
