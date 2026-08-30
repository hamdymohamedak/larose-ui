import { useId, useMemo } from 'react';
import type { Size, UIState } from '@larose-ui/core';
import { resolveUIState } from '@larose-ui/core';
import { FieldShell } from '../DataEntry/FieldShell';
import { fieldIdFromLabel } from '../DataEntry/utils';
import { Popover } from '../Popover/Popover';
import type { PickerColumn, PickerStyle, PickerValue } from './types';
import { WheelPicker } from './WheelPicker';
import styles from './Picker.module.css';

export interface PickerProps {
  columns: PickerColumn[];
  value: PickerValue;
  onChange: (value: PickerValue) => void;
  style?: PickerStyle;
  label?: string;
  hint?: string;
  error?: string | null;
  state?: UIState;
  loading?: boolean;
  disabled?: boolean;
  inputSize?: Size;
  /** Shown on the compact trigger when no selection exists. */
  placeholder?: string;
  /** Formats the compact trigger label from the current value. */
  formatValue?: (value: PickerValue, columns: PickerColumn[]) => string;
  'aria-label'?: string;
}

function defaultFormatValue(value: PickerValue, columns: PickerColumn[]): string {
  return columns
    .map((column) => {
      const selected = column.options.find((option) => option.value === value[column.id]);
      return selected?.label ?? value[column.id];
    })
    .filter(Boolean)
    .join(' ');
}

/**
 * Multipart picker with scrollable wheel columns — Apple HIG picker pattern.
 * @see https://developer.apple.com/design/human-interface-guidelines/pickers
 */
export function Picker({
  columns,
  value,
  onChange,
  style = 'wheels',
  label,
  hint,
  error = null,
  state,
  loading = false,
  disabled = false,
  placeholder = 'Select',
  formatValue = defaultFormatValue,
  'aria-label': ariaLabel,
}: PickerProps) {
  const fieldId = useId();
  const inputId = label ? fieldIdFromLabel(label) : fieldId;
  const uiState = resolveUIState({ state, loading, error, disabled });
  const errorMessage = typeof error === 'string' ? error : null;
  const isDisabled = disabled || uiState === 'disabled' || uiState === 'loading';

  const displayLabel = useMemo(() => {
    const formatted = formatValue(value, columns).trim();
    return formatted || placeholder;
  }, [columns, formatValue, placeholder, value]);

  const wheels = (
    <WheelPicker
      columns={columns}
      value={value}
      onChange={onChange}
      disabled={isDisabled}
      compact={style === 'compact'}
      aria-label={ariaLabel ?? label ?? 'Picker'}
    />
  );

  if (style === 'compact') {
    return (
      <FieldShell
        label={label}
        hint={hint}
        error={errorMessage}
        htmlFor={inputId}
        uiState={uiState}
      >
        <div className={styles.compactField}>
          <Popover
            side="bottom"
            aria-label={ariaLabel ?? label ?? 'Picker'}
            panelClassName={styles.compactPopover}
            trigger={
              <button
                id={inputId}
                type="button"
                className={styles.compactTrigger}
                disabled={isDisabled}
                aria-haspopup="dialog"
              >
                <span className={styles.compactValue}>{displayLabel}</span>
                <span className={styles.compactChevron} aria-hidden="true">
                  ▾
                </span>
              </button>
            }
            content={<div className={styles.popoverPanelWheels}>{wheels}</div>}
          />
        </div>
      </FieldShell>
    );
  }

  return (
    <FieldShell label={label} hint={hint} error={errorMessage} htmlFor={inputId} uiState={uiState}>
      <div className={styles.picker}>{wheels}</div>
    </FieldShell>
  );
}
