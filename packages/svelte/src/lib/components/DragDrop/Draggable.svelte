<script lang="ts">
  import type { Snippet } from 'svelte';
  import { DRAG_START_THRESHOLD_PX } from '@larose-ui/tokens';
  import { getDragDropContext } from '../../DragDrop/context';
  import type { DragItem } from '../../DragDrop/types';
  import { shouldBeginDrag } from '@larose-ui/primitives';
  import styles from '@larose-ui/styles/components/DragDrop/DragDrop.module.css';
  import { cn } from '../../utils/cn';

  let {
    id,
    sourceId,
    data,
    type,
    label,
    disabled = false,
    class: className,
    style,
    children,
  }: {
    id: string;
    sourceId: string;
    data: unknown;
    type?: string;
    label?: string;
    disabled?: boolean;
    class?: string;
    style?: string;
    children?: Snippet;
  } = $props();

  const ctx = getDragDropContext();
  let el = $state<HTMLDivElement | null>(null);
  let pending = $state(false);
  let origin: { x: number; y: number; pointerId: number } | null = null;
  const isDragging = $derived(ctx.getSession()?.items.some((item) => item.id === id) ?? false);

  function buildItem(): DragItem {
    return { id, sourceId, data, type, label };
  }

  $effect(() => {
    if (!ctx.getSession()) {
      pending = false;
      origin = null;
    }
  });
</script>

<div
  bind:this={el}
  class={cn(styles.draggable, className)}
  {style}
  data-dragging={isDragging ? 'true' : undefined}
  data-disabled={disabled ? 'true' : undefined}
  aria-grabbed={isDragging ? true : undefined}
  onpointerdown={(event) => {
    if (disabled || event.button !== 0) return;
    origin = { x: event.clientX, y: event.clientY, pointerId: event.pointerId };
    pending = true;
    el?.setPointerCapture(event.pointerId);
  }}
  onpointermove={(event) => {
    if (!pending || !origin || event.pointerId !== origin.pointerId) return;
    const session = ctx.getSession();
    if (
      !session &&
      shouldBeginDrag(origin.x, origin.y, event.clientX, event.clientY, DRAG_START_THRESHOLD_PX) &&
      el
    ) {
      ctx.beginPointerDrag(buildItem(), event.pointerId, event.clientX, event.clientY, el);
      pending = false;
      return;
    }
    if (session && session.pointerId === event.pointerId) {
      ctx.updatePointer(event.clientX, event.clientY);
    }
  }}
  onpointerup={(event) => {
    const session = ctx.getSession();
    if (session && session.pointerId === event.pointerId) {
      void ctx.endPointer(event.clientX, event.clientY, event.altKey);
    }
    if (pending && session && event.shiftKey) {
      ctx.addItemToSession(buildItem());
    }
    pending = false;
    origin = null;
  }}
>
  {@render children?.()}
</div>
