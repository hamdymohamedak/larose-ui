<script lang="ts">
  import type { UIState } from '@larose-ui/core';
  import styles from '@larose-ui/styles/components/Progress/Progress.module.css';

  export type ProgressVariant = 'default' | 'success' | 'error';

  interface Props {
    value: number;
    max?: number;
    label?: string;
    variant?: ProgressVariant;
    state?: UIState;
    showValue?: boolean;
    class?: string;
    style?: string;
  }

  let {
    value,
    max = 100,
    label,
    variant = 'default',
    state = 'idle',
    showValue = false,
    class: className,
    style,
  }: Props = $props();

  const clamped = $derived(Math.min(max, Math.max(0, value)));
  const percent = $derived(max > 0 ? Math.round((clamped / max) * 100) : 0);
</script>

<div class={[styles.wrapper, className].filter(Boolean).join(' ')} {style} data-state={state}>
  {#if label || showValue}
    <div class={styles.header}>
      {#if label}<span class={styles.label}>{label}</span>{/if}
      {#if showValue}<span class={styles.value}>{percent}%</span>{/if}
    </div>
  {/if}
  <div
    class={styles.track}
    role="progressbar"
    aria-valuemin={0}
    aria-valuemax={max}
    aria-valuenow={clamped}
    aria-label={label}
    data-variant={variant}
    data-state={state}
  >
    <div class={styles.bar} style={`width: ${percent}%`}></div>
  </div>
</div>
