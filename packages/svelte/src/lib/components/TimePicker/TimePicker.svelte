<script lang="ts">
  import type { Size, UIState } from '@larose-ui/core';
  import { resolveUIState } from '@larose-ui/core';
  import styles from '@larose-ui/styles/components/DatePicker/datetime-field.module.css';
  import { cn } from '../../utils/cn';
  import { fieldIdFromLabel } from '../../data-entry/utils';

  interface Props {
    label?: string;
    hint?: string;
    fieldState?: UIState;
    loading?: boolean;
    error?: string | null;
    inputSize?: Size;
    value?: string;
    disabled?: boolean;
    readOnly?: boolean;
    id?: string;
    class?: string;
    style?: string;
    min?: string;
    max?: string;
  }

  let {
    label,
    hint,
    fieldState,
    loading = false,
    error = null,
    inputSize = 'md',
    value = $bindable(''),
    disabled,
    readOnly,
    id,
    class: className,
    style,
    min,
    max,
  }: Props = $props();

  const inputId = $derived(id ?? (label ? fieldIdFromLabel(label) : undefined));
  const uiState = $derived(
    resolveUIState({
      state: fieldState,
      loading,
      error,
      disabled,
      readonly: readOnly,
    }),
  );
  const errorMessage = $derived(typeof error === 'string' ? error : null);
</script>

<div class={cn(styles.wrapper, className)} {style} data-state={uiState}>
  {#if label}<label for={inputId} class={styles.label}>{label}</label>{/if}
  <div class={styles.inputContainer}>
    <input
      id={inputId}
      type="time"
      class={styles.input}
      data-size={inputSize}
      data-state={uiState}
      bind:value
      disabled={disabled || uiState === 'disabled' || uiState === 'loading'}
      readonly={readOnly || uiState === 'readonly'}
      {min}
      {max}
      aria-invalid={uiState === 'error'}
      aria-busy={uiState === 'loading'}
    />
  </div>
  {#if hint && !errorMessage}<span id={`${inputId}-hint`} class={styles.hint}>{hint}</span>{/if}
  {#if errorMessage}<span id={`${inputId}-error`} class={styles.error} role="alert">{errorMessage}</span>{/if}
</div>
