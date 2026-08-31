<script lang="ts">
  import type { Size } from '@larose-ui/core';
  import styles from '@larose-ui/styles/components/Radio/Radio.module.css';
  import { cn } from '../../utils/cn';

  interface Props {
    label: string;
    hint?: string;
    error?: string | null;
    disabled?: boolean;
    boxSize?: Size;
    id?: string;
    name?: string;
    value?: string;
    class?: string;
    group?: string;
    onchange?: (event: Event) => void;
  }

  let {
    label,
    hint,
    error = null,
    disabled,
    boxSize = 'md',
    id,
    name,
    value = '',
    class: className,
    group = $bindable(''),
    onchange,
  }: Props = $props();

  const inputId = $derived(id ?? label.toLowerCase().replace(/\s+/g, '-'));
</script>

<div class={styles.wrapper} data-state={error ? 'error' : 'default'}>
  <label for={inputId} class={styles.row}>
    <input
      id={inputId}
      type="radio"
      {name}
      {value}
      class={cn(styles.input, className)}
      data-size={boxSize}
      {disabled}
      bind:group
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
