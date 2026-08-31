<script lang="ts">
  import type { Size } from '@larose-ui/core';
  import styles from '@larose-ui/styles/components/Switch/Switch.module.css';
  import { cn } from '../../utils/cn';

  interface Props {
    label: string;
    hint?: string;
    disabled?: boolean;
    switchSize?: Size;
    id?: string;
    class?: string;
    checked?: boolean;
  }

  let {
    label,
    hint,
    disabled,
    switchSize = 'md',
    id,
    class: className,
    checked = $bindable(false),
  }: Props = $props();

  const inputId = $derived(id ?? label.toLowerCase().replace(/\s+/g, '-'));

  function toggle() {
    if (disabled) return;
    checked = !checked;
  }
</script>

<div class={styles.wrapper}>
  <div class={styles.row}>
    <button
      id={inputId}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      aria-describedby={hint ? `${inputId}-hint` : undefined}
      class={cn(styles.track, className)}
      data-size={switchSize}
      data-state={checked ? 'on' : 'off'}
      {disabled}
      onclick={toggle}
    >
      <span class={styles.thumb} aria-hidden="true"></span>
    </button>
    <span class={styles.label}>{label}</span>
  </div>
  {#if hint}
    <span id={`${inputId}-hint`} class={styles.hint}>{hint}</span>
  {/if}
</div>
