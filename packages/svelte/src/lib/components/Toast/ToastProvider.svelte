<script lang="ts">
  import type { Snippet } from 'svelte';
  import {
    setToast,
    type ToastInput,
    type ToastPlacement,
  } from '../../toast/context';
  import { portal } from '../../utils/portal';
  import styles from '@larose-ui/styles/components/Toast/Toast.module.css';
  import Toast from './Toast.svelte';

  interface ToastRecord extends ToastInput {
    id: string;
    exiting?: boolean;
  }

  interface Props {
    children: Snippet;
    placement?: ToastPlacement;
  }

  let { children, placement = 'bottom-right' }: Props = $props();

  let toasts = $state<ToastRecord[]>([]);

  function removeToast(id: string) {
    toasts = toasts.filter((item) => item.id !== id);
  }

  function dismiss(id: string) {
    toasts = toasts.map((item) => (item.id === id ? { ...item, exiting: true } : item));
  }

  function toast(input: ToastInput) {
    const id = crypto.randomUUID();
    toasts = [...toasts, { ...input, id }];
    window.setTimeout(() => dismiss(id), input.duration ?? 5000);
    return id;
  }

  setToast({ toast, dismiss });
</script>

{@render children()}

<div use:portal class={styles.viewport} data-placement={placement} aria-live="polite" aria-relevant="additions">
  {#each toasts as item (item.id)}
    <Toast
      {item}
      {placement}
      onDismiss={() => dismiss(item.id)}
      onExitComplete={() => removeToast(item.id)}
    />
  {/each}
</div>
