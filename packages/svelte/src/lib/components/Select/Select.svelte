<script lang="ts">
  import type { Size, UIState } from '@larose-ui/core';
  import { resolveUIState } from '@larose-ui/core';
  import styles from '@larose-ui/styles/components/Select/Select.module.css';
  import FieldShell from '../FieldShell/FieldShell.svelte';
  import Spinner from '../Spinner/Spinner.svelte';
  import { cn } from '../../utils/cn';
  import { fieldIdFromLabel } from '../../data-entry/utils';

  export interface SelectOption {
    label: string;
    value: string;
  }

  interface Props {
    label?: string;
    hint?: string;
    options: SelectOption[];
    placeholder?: string;
    state?: UIState;
    loading?: boolean;
    error?: string | null;
    disabled?: boolean;
    required?: boolean;
    inputSize?: Size;
    id?: string;
    class?: string;
    value?: string;
  }

  let {
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
    id,
    class: className,
    value = $bindable(''),
  }: Props = $props();

  const inputId = $derived(id ?? (label ? fieldIdFromLabel(label) : undefined));
  const uiState = $derived(resolveUIState({ state, loading, error, disabled }));
  const errorMessage = $derived(typeof error === 'string' ? error : null);
</script>

<FieldShell
  {label}
  {hint}
  error={errorMessage}
  {required}
  htmlFor={inputId}
  {uiState}
>
  <div class={styles.inputContainer}>
    <select
      id={inputId}
      class={cn(styles.select, className)}
      data-size={inputSize}
      data-state={uiState}
      bind:value
      disabled={disabled || uiState === 'disabled'}
      {required}
      aria-invalid={uiState === 'error'}
      aria-busy={uiState === 'loading'}
    >
      <option value="" disabled>{placeholder}</option>
      {#each options as option (option.value)}
        <option value={option.value}>{option.label}</option>
      {/each}
    </select>
    {#if uiState === 'loading'}
      <span class={styles.loadingIndicator} aria-hidden="true">
        <Spinner size="sm" />
      </span>
    {/if}
  </div>
</FieldShell>
