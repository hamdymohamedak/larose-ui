<script lang="ts">
  import type { DragSession } from '../../DragDrop/types';
  import { portal } from '../../utils/portal';
  import styles from '@larose-ui/styles/components/DragDrop/DragDrop.module.css';

  let { session, revert }: { session: DragSession | null; revert: boolean } = $props();
  const primary = $derived(session?.items[0]);
  const count = $derived(session?.items.length ?? 0);
</script>

{#if session}
  <div use:portal class={styles.previewLayer} aria-hidden="true">
    <div
      class={styles.preview}
      data-revert={revert ? 'true' : undefined}
      style={`left:${session.x}px;top:${session.y}px;transform:${revert ? 'translate(-50%, -50%) scale(0.85)' : 'translate(-50%, -50%)'}`}
    >
      {primary?.label ?? 'Dragging…'}
      {#if count > 1}<span class={styles.badge}>{count}</span>{/if}
    </div>
  </div>
{/if}
