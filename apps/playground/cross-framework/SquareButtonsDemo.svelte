<script lang="ts">
  import SquareButton from '../../../packages/svelte/src/lib/components/Button/SquareButton.svelte';
</script>

<div style="display: flex; gap: 0.5rem; align-items: center">
  <SquareButton aria-label="Add row" tooltip="Add row">
    {#snippet icon()}+{/snippet}
  </SquareButton>
  <SquareButton aria-label="Remove row" tooltip="Remove row">
    {#snippet icon()}−{/snippet}
  </SquareButton>
</div>
