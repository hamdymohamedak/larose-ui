<script lang="ts">
  import type { Size } from '@larose-ui/core';
  import styles from '@larose-ui/styles/components/Checkbox/Checkbox.module.css';
  import { cn } from '../../utils/cn';

  interface Props {
    label: string;
    hint?: string;
    error?: string | null;
    disabled?: boolean;
    boxSize?: Size;
    id?: string;
    class?: string;
    style?: string;
    checked?: boolean;
    onchange?: (event: Event) => void;
  }

  let {
    label,
    hint,
    error = null,
    disabled,
    boxSize = 'md',
    id,
    class: className,
    style,
    checked = $bindable(false),
    onchange,
  }: Props = $props();

  const inputId = $derived(id ?? label.toLowerCase().replace(/\s+/g, '-'));
</script>

<div class={styles.wrapper} {style} data-state={error ? 'error' : 'default'}>
  <label for={inputId} class={styles.row}>
    <input
      id={inputId}
      type="checkbox"
      class={cn(styles.input, className)}
      data-size={boxSize}
      {disabled}
      bind:checked
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
      onchange={onchange}
    />
    <span class={styles.label}>{label}</span>
  </label>
  {#if hint && !error}
    <span id={`${inputId}-hint`} class={styles.hint}>{hint}</span>
  {/if}
  {#if error}
    <span id={`${inputId}-error`} class={styles.error} role="alert">{error}</span>
  {/if}
</div>
