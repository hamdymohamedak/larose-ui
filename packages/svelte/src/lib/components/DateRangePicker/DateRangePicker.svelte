<script lang="ts">
  import type { Size, UIState } from '@larose-ui/core';
  import { resolveUIState } from '@larose-ui/core';
  import styles from '@larose-ui/styles/components/DatePicker/datetime-field.module.css';
  import { cn } from '../../utils/cn';

  export interface DateRange {
    startDate: string;
    endDate: string;
  }

  interface Props {
    label?: string;
    startLabel?: string;
    endLabel?: string;
    hint?: string;
    fieldState?: UIState;
    loading?: boolean;
    error?: string | null;
    inputSize?: Size;
    value?: DateRange;
    min?: string;
    max?: string;
    disabled?: boolean;
    readOnly?: boolean;
    class?: string;
    style?: string;
    id?: string;
  }

  let {
    label,
    startLabel = 'Start date',
    endLabel = 'End date',
    hint,
    fieldState,
    loading = false,
    error = null,
    inputSize = 'md',
    value = $bindable<DateRange>({ startDate: '', endDate: '' }),
    min,
    max,
    disabled,
    readOnly,
    class: className,
    style,
    id,
  }: Props = $props();

  const groupId = $derived(id ?? `date-range-${Math.random().toString(36).slice(2)}`);
  const uiState = $derived(
    resolveUIState({ state: fieldState, loading, error, disabled, readonly: readOnly }),
  );
  const errorMessage = $derived(typeof error === 'string' ? error : null);
</script>

<fieldset class={cn(styles.wrapper, className)} {style} data-state={uiState}>
  {#if label}<legend class={styles.label}>{label}</legend>{/if}
  <div class={styles.range}>
    <div class={styles.rangeField}>
      <label for={`${groupId}-start`} class={styles.label}>{startLabel}</label>
      <div class={styles.inputContainer}>
        <input
          id={`${groupId}-start`}
          type="date"
          class={styles.input}
          data-size={inputSize}
          bind:value={value.startDate}
          disabled={disabled || uiState === 'disabled'}
          readonly={readOnly}
          {min}
          max={value.endDate || max}
        />
      </div>
    </div>
    <div class={styles.rangeField}>
      <label for={`${groupId}-end`} class={styles.label}>{endLabel}</label>
      <div class={styles.inputContainer}>
        <input
          id={`${groupId}-end`}
          type="date"
          class={styles.input}
          data-size={inputSize}
          bind:value={value.endDate}
          disabled={disabled || uiState === 'disabled'}
          readonly={readOnly}
          min={value.startDate || min}
          {max}
        />
      </div>
    </div>
  </div>
  {#if hint && !errorMessage}<span class={styles.hint}>{hint}</span>{/if}
  {#if errorMessage}<span class={styles.error} role="alert">{errorMessage}</span>{/if}
</fieldset>
