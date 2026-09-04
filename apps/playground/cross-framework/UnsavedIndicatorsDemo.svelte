<script lang="ts">
  import Card from '../../../packages/svelte/src/lib/components/Card/Card.svelte';
  import UnsavedIndicator from '../../../packages/svelte/src/lib/components/FileManagement/UnsavedIndicator.svelte';
</script>

<Card title="Autosave vs manual save" padding="md">
  <div style="display: flex; flex-direction: column; gap: 0.75rem">
    <UnsavedIndicator title="Untitled" edited autosaveEnabled />
    <UnsavedIndicator title="Budget Proposal" edited={false} autosaveEnabled />
    <UnsavedIndicator title="Meeting Notes" edited autosaveEnabled={false} />
  </div>
</Card>
