<script lang="ts">
  import type { Snippet } from 'svelte';
  import { getDragDropContext } from '../../DragDrop/context';
  import type { DragItem, DropResult } from '../../DragDrop/types';
  import styles from '@larose-ui/styles/components/DragDrop/DragDrop.module.css';
  import { cn } from '../../utils/cn';

  let {
    id,
    accepts,
    disabled = false,
    canDrop,
    onDrop,
    children,
    class: className,
    style,
    showInvalidIndicator = true,
    transferring = false,
    transferringLabel = 'Transferring…',
  }: {
    id: string;
    accepts?: string | string[];
    disabled?: boolean;
    canDrop?: (items: DragItem[]) => boolean;
    onDrop: (result: DropResult) => void | Promise<void>;
    children?: Snippet;
    class?: string;
    style?: string;
    showInvalidIndicator?: boolean;
    transferring?: boolean;
    transferringLabel?: string;
  } = $props();

  const ctx = getDragDropContext();
  let element = $state<HTMLDivElement | null>(null);
  const target = $derived(ctx.getTarget());
  const session = $derived(ctx.getSession());
  const isActive = $derived(target?.zoneId === id && target.valid);
  const isInvalid = $derived(target?.zoneId === id && !target.valid);
  const zoneState = $derived(isActive ? 'active' : isInvalid ? 'invalid' : 'idle');

  $effect(() => {
    if (!element) return;
    return ctx.registerZone({ id, accepts, canDrop, onDrop, element });
  });
</script>

<div
  bind:this={element}
  class={cn(styles.dropZone, className)}
  {style}
  data-state={zoneState}
  data-disabled={disabled ? 'true' : undefined}
  aria-dropeffect={disabled ? 'none' : isActive ? 'move' : undefined}
>
  {#if transferring}
    <div class={styles.placeholder} role="status">{transferringLabel}</div>
  {:else}
    {@render children?.()}
  {/if}
  {#if isInvalid && showInvalidIndicator && session}
    <div class={styles.invalidIcon} aria-hidden="true">⊘</div>
  {/if}
</div>
