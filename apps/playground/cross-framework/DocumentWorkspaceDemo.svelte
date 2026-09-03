<script lang="ts">
  import DocumentToolbar from '../../../packages/svelte/src/lib/components/FileManagement/DocumentToolbar.svelte';
  import UnsavedIndicator from '../../../packages/svelte/src/lib/components/FileManagement/UnsavedIndicator.svelte';
  import Header from '../../../packages/svelte/src/lib/components/Header/Header.svelte';
  import HeaderActions from '../../../packages/svelte/src/lib/components/Header/HeaderActions.svelte';
  import HeaderTitle from '../../../packages/svelte/src/lib/components/Header/HeaderTitle.svelte';
  import Typography from '../../../packages/svelte/src/lib/components/Typography/Typography.svelte';

  interface Props {
    title?: string;
  }

  let { title = 'Product Roadmap' }: Props = $props();
  let edited = $state(true);
  let autosave = $state(true);
</script>

<Header>
  <HeaderTitle>
    <UnsavedIndicator {title} {edited} autosaveEnabled={autosave} />
  </HeaderTitle>
  <HeaderActions>
    <DocumentToolbar
      showAddButton={false}
      saveLabel="Save"
      canSave={edited}
      onSave={() => {
        edited = false;
      }}
    />
  </HeaderActions>
</Header>
<div style="margin-top: 1rem; display: grid; gap: 1rem">
  <Typography role="footnote" muted>
    Toggle autosave to see the unsaved-changes dot when manual save is required.
  </Typography>
  <label style="display: inline-flex; gap: 0.5rem; align-items: center">
    <input type="checkbox" bind:checked={autosave} />
    Autosave enabled
  </label>
  <button type="button" onclick={() => (edited = true)}>Mark as edited</button>
</div>
