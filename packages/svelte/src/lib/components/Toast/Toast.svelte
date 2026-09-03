<script lang="ts">
  import type { ToastInput, ToastPlacement } from '../../toast/context';
  import styles from '@larose-ui/styles/components/Toast/Toast.module.css';
  import { cn } from '../../utils/cn';

  interface ToastRecord extends ToastInput {
    id: string;
    exiting?: boolean;
  }

  interface Props {
    item: ToastRecord;
    placement: ToastPlacement;
    onDismiss: () => void;
    onExitComplete: () => void;
  }

  let { item, placement, onDismiss, onExitComplete }: Props = $props();

  const variant = $derived(item.variant ?? 'info');

  $effect(() => {
    if (!item.exiting) return;
    const timer = window.setTimeout(onExitComplete, 180);
    return () => window.clearTimeout(timer);
  });
</script>

<div
  class={cn(styles.toast, item.class)}
  style={item.style}
  data-variant={variant}
  data-placement={placement}
  role={variant === 'error' ? 'alert' : 'status'}
>
  <div class={styles.content}>
    {#if item.title}
      <strong class={styles.title}>{item.title}</strong>
    {/if}
    <span class={styles.message}>{item.message}</span>
  </div>
  <button type="button" class={styles.dismiss} onclick={onDismiss} aria-label="Dismiss">×</button>
</div>
