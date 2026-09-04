<script lang="ts">
  import type { Snippet } from 'svelte';
  import styles from '@larose-ui/styles/components/Dialog/Dialog.module.css';
  import Modal from '../Modal/Modal.svelte';
  import Button from '../Button/Button.svelte';

  interface Props {
    open: boolean;
    title: string;
    description?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    loading?: boolean;
    variant?: 'default' | 'destructive';
    showConfirm?: boolean;
    onclose?: () => void;
    onconfirm?: () => void;
    children?: Snippet;
    class?: string;
    style?: string;
  }

  let {
    open,
    title,
    description,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    loading = false,
    variant = 'default',
    showConfirm = true,
    onclose,
    onconfirm,
    children,
    class: className,
    style,
  }: Props = $props();
</script>

<Modal {open} {title} {description} {onclose} class={className} {style}>
  {#if children}
    <div class={styles.body}>{@render children()}</div>
  {/if}
  <div class={styles.actions}>
    <Button buttonRole="cancel" variant="secondary" disabled={loading} onclick={onclose}>
      {cancelLabel}
    </Button>
    {#if showConfirm}
      <Button
        variant={variant === 'destructive' ? 'ghost' : 'primary'}
        buttonRole={variant === 'destructive' ? 'destructive' : 'primary'}
        {loading}
        onclick={onconfirm}
      >
        {confirmLabel}
      </Button>
    {/if}
  </div>
</Modal>
