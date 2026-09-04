<script lang="ts">
  import List from '../../../packages/svelte/src/lib/components/ListTable/List.svelte';
  import ListSection from '../../../packages/svelte/src/lib/components/ListTable/ListSection.svelte';
  import ListRow from '../../../packages/svelte/src/lib/components/ListTable/ListRow.svelte';

  let {
    variant = 'grouped' as 'grouped' | 'plain',
  }: { variant?: 'grouped' | 'plain' } = $props();
</script>

<List {variant} aria-label="Settings">
  <ListSection header="Account" footer="Changes sync across your devices.">
    <ListRow title="Apple ID" subtitle="sara@icloud.com" accessory="disclosure" />
    <ListRow title="iCloud" subtitle="5 GB of 5 GB used" accessory="disclosure" />
  </ListSection>
  <ListSection header="Notifications">
    <ListRow title="Allow Notifications" accessory="checkmark" selected />
    <ListRow title="Sounds" accessory="disclosure" />
  </ListSection>
</List>
