<script lang="ts">
  import type { Size, UIState } from '@larose-ui/core';
  import { resolveUIState } from '@larose-ui/core';
  import styles from '@larose-ui/styles/components/Textarea/Textarea.module.css';
  import FieldShell from '../FieldShell/FieldShell.svelte';
  import { cn } from '../../utils/cn';
  import { fieldIdFromLabel } from '../../data-entry/utils';

  interface Props {
    label?: string;
    hint?: string;
    state?: UIState;
    loading?: boolean;
    error?: string | null;
    disabled?: boolean;
    readOnly?: boolean;
    required?: boolean;
    inputSize?: Size;
    id?: string;
    rows?: number;
    class?: string;
    style?: string;
    value?: string;
  }

  let {
    label,
    hint,
    state,
    loading = false,
    error = null,
    disabled,
    readOnly,
    required = false,
    inputSize = 'md',
    id,
    rows = 4,
    class: className,
    style,
    value = $bindable(''),
  }: Props = $props();

  const inputId = $derived(id ?? (label ? fieldIdFromLabel(label) : undefined));
  const uiState = $derived(
    resolveUIState({ state, loading, error, disabled, readonly: readOnly }),
  );
  const errorMessage = $derived(typeof error === 'string' ? error : null);
</script>

<FieldShell
  {label}
  {hint}
  error={errorMessage}
  {required}
  htmlFor={inputId}
  {uiState}
  class={className}
  {style}
>
  <div class={styles.inputContainer}>
    <textarea
      id={inputId}
      {rows}
      class={cn(styles.textarea, className)}
      data-size={inputSize}
      data-state={uiState}
      bind:value
      disabled={disabled || uiState === 'disabled'}
      readonly={readOnly || uiState === 'readonly'}
      {required}
      aria-invalid={uiState === 'error'}
      aria-busy={uiState === 'loading'}
      aria-describedby={errorMessage ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
    ></textarea>
    {#if uiState === 'loading'}
      <span class={styles.loadingIndicator} aria-hidden="true"></span>
    {/if}
  </div>
</FieldShell>
