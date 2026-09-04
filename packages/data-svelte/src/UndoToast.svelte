<script lang="ts">
  import type { UndoAction } from '@larose-ui/data-core';

  interface Props {
    actions: UndoAction[];
    onUndo: (id: string) => void;
    onDismiss: (id: string) => void;
  }

  let { actions, onUndo, onDismiss }: Props = $props();
</script>

{#if actions.length > 0}
  <div
    style="
      position: fixed;
      bottom: var(--lr-space-6);
      right: var(--lr-space-6);
      display: flex;
      flex-direction: column;
      gap: var(--lr-space-2);
      z-index: 1100;
    "
  >
    {#each actions as action (action.id)}
      <div
        role="status"
        style="
          display: flex;
          align-items: center;
          gap: var(--lr-space-3);
          padding: var(--lr-space-3) var(--lr-space-4);
          background: var(--lr-color-surface-elevated);
          border: 1px solid var(--lr-color-border);
          border-radius: var(--lr-radius-md);
          box-shadow: var(--lr-shadow-md);
        "
      >
        <span style="font-size: var(--lr-font-size-sm)">{action.label}</span>
        <button type="button" style="font-weight: 600" onclick={() => onUndo(action.id)}>
          Undo
        </button>
        <button type="button" aria-label="Dismiss" onclick={() => onDismiss(action.id)}>
          ×
        </button>
      </div>
    {/each}
  </div>
{/if}
