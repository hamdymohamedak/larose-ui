<script lang="ts">
  import type { Snippet } from 'svelte';
  import styles from '@larose-ui/styles/components/Alert/Alert.module.css';

  export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

  interface Props {
    variant?: AlertVariant;
    title?: string;
    onDismiss?: () => void;
    children: Snippet;
  }

  let { variant = 'info', title, onDismiss, children }: Props = $props();
</script>

<div class={styles.alert} data-variant={variant} role="alert">
  <div class={styles.content}>
    {#if title}<strong class={styles.title}>{title}</strong>{/if}
    <div class={styles.message}>{@render children()}</div>
  </div>
  {#if onDismiss}
    <button type="button" class={styles.dismiss} aria-label="Dismiss alert" onclick={onDismiss}>
      ×
    </button>
  {/if}
</div>
