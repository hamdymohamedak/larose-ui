<script lang="ts">
  import type { Size, UIState } from '@larose-ui/core';
  import { resolveUIState } from '@larose-ui/core';
  import styles from '@larose-ui/styles/components/Input/Input.module.css';
  import FieldShell from '../FieldShell/FieldShell.svelte';
  import Spinner from '../Spinner/Spinner.svelte';
  import { cn } from '../../utils/cn';
  import { getComponentDefaults } from '../../theme/context';
  import { fieldIdFromLabel } from '../../data-entry/utils';

  interface Props {
    label?: string;
    hint?: string;
    fieldState?: UIState;
    loading?: boolean;
    error?: string | null;
    disabled?: boolean;
    readOnly?: boolean;
    required?: boolean;
    inputSize?: Size;
    id?: string;
    type?: string;
    class?: string;
    style?: string;
    value?: string;
  }

  let {
    label,
    hint,
    fieldState,
    loading = false,
    error = null,
    disabled,
    readOnly,
    required = false,
    inputSize = 'md',
    id,
    type = 'text',
    class: className,
    style,
    value = $bindable(''),
  }: Props = $props();

  const merged = $derived(getComponentDefaults('Input', {
    label,
    hint,
    state: fieldState,
    loading,
    error,
    disabled,
    readOnly,
    required,
    inputSize,
    id,
    type,
    class: className,
    style,
  }));

  let focused = $state(false);

  const inputId = $derived(merged.id ?? (merged.label ? fieldIdFromLabel(merged.label) : undefined));
  const uiState = $derived(
    resolveUIState({
      state: merged.state,
      loading: merged.loading,
      error: merged.error,
      disabled: merged.disabled,
      readonly: merged.readOnly,
    }),
  );
  const errorMessage = $derived(typeof merged.error === 'string' ? merged.error : null);
</script>

<FieldShell
  label={merged.label}
  hint={merged.hint}
  error={errorMessage}
  required={merged.required}
  htmlFor={inputId}
  uiState={uiState}
  class={merged.class}
  style={merged.style}
>
  <div class={styles.inputContainer}>
    <div
      class={styles.inputShell}
      data-size={merged.inputSize ?? 'md'}
      data-state={uiState}
      data-focused={focused ? 'true' : undefined}
    >
      <input
        id={inputId}
        type={merged.type ?? 'text'}
        class={cn(styles.input, merged.class)}
        data-size={merged.inputSize ?? 'md'}
        bind:value
        disabled={merged.disabled || uiState === 'disabled'}
        readonly={merged.readOnly || uiState === 'readonly'}
        required={merged.required}
        aria-invalid={uiState === 'error'}
        aria-busy={uiState === 'loading'}
        aria-describedby={errorMessage ? `${inputId}-error` : merged.hint ? `${inputId}-hint` : undefined}
        onfocus={() => (focused = true)}
        onblur={() => (focused = false)}
      />
      {#if uiState === 'loading'}
        <span class={styles.loadingIndicator} aria-hidden="true">
          <Spinner size="sm" />
        </span>
      {/if}
    </div>
  </div>
</FieldShell>
