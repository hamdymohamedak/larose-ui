<script lang="ts">
  import type { Snippet } from 'svelte';
  import { getSplitViewContext } from '../../SplitView/context';
  import styles from '@larose-ui/styles/components/SplitView/SplitView.module.css';

  let {
    actions,
    class: className,
    style,
  }: { actions?: Snippet; class?: string; style?: string } = $props();

  const ctx = getSplitViewContext();
  const hiddenPanes = $derived(ctx.hiddenPanes);
</script>

{#if actions || hiddenPanes.length > 0}
  <div
    class={[styles.toolbar, className].filter(Boolean).join(' ')}
    {style}
    role="toolbar"
    aria-label="Split view toolbar"
  >
    {@render actions?.()}
    {#each hiddenPanes as pane (pane.id)}
      <button type="button" class={styles.toolbarButton} onclick={() => ctx.showPane(pane.id)}>
        Show {pane.label}
      </button>
    {/each}
  </div>
{/if}
