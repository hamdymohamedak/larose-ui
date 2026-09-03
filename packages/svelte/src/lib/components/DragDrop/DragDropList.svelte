<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { DropResult } from '../../DragDrop/types';
  import DragDropProvider from './DragDropProvider.svelte';
  import Draggable from './Draggable.svelte';
  import DropZone from './DropZone.svelte';
  import styles from '@larose-ui/styles/components/DragDrop/DragDrop.module.css';
  import { cn } from '../../utils/cn';

  export interface DragDropListItem {
    id: string;
    label: string;
    type?: string;
  }

  let {
    zoneId = 'list',
    items,
    onReorder,
    renderItem,
    class: className,
    style,
  }: {
    zoneId?: string;
    items: DragDropListItem[];
    onReorder: (items: DragDropListItem[]) => void;
    renderItem?: Snippet<[DragDropListItem]>;
    class?: string;
    style?: string;
  } = $props();

  let transferring = $state(false);

  async function handleDrop(result: DropResult) {
    if (result.destinationId !== zoneId || result.operation !== 'move') return;
    const dragged = result.items[0]?.data as DragDropListItem | undefined;
    if (!dragged) return;
    transferring = true;
    await new Promise((resolve) => window.setTimeout(resolve, 400));
    const fromIndex = items.findIndex((item) => item.id === dragged.id);
    if (fromIndex < 0) {
      transferring = false;
      return;
    }
    const next = [...items];
    const [removed] = next.splice(fromIndex, 1);
    next.push(removed!);
    onReorder(next);
    transferring = false;
  }
</script>

<DragDropProvider>
  <DropZone
    id={zoneId}
    accepts="list-item"
    onDrop={handleDrop}
    {transferring}
    transferringLabel="Moving item…"
    class={cn(className)}
    {style}
  >
    <ul class={styles.list} role="list">
      {#each items as item (item.id)}
        <li>
          <Draggable id={item.id} sourceId={zoneId} data={item} type="list-item" label={item.label}>
            <div class={styles.listItem}>
              <span class={styles.listItemHandle} aria-hidden="true">⠿</span>
              <span class={styles.listItemLabel}>
                {#if renderItem}{@render renderItem(item)}{:else}{item.label}{/if}
              </span>
            </div>
          </Draggable>
        </li>
      {/each}
    </ul>
  </DropZone>
</DragDropProvider>
