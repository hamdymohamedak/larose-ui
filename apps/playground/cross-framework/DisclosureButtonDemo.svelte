<script lang="ts">
  import DisclosureButton from '../../../packages/svelte/src/lib/components/Disclosure/DisclosureButton.svelte';
  import Input from '../../../packages/svelte/src/lib/components/Input/Input.svelte';
  import Select from '../../../packages/svelte/src/lib/components/Select/Select.svelte';

  interface Props {
    expanded?: boolean;
    defaultExpanded?: boolean;
    label?: string;
  }

  let {
    expanded,
    defaultExpanded = false,
    label = 'Save document',
  }: Props = $props();
</script>

<DisclosureButton {label} {expanded} {defaultExpanded} ariaLabel="Show save locations">
  <Input label="Save As" value="Quarterly Report" />
  {#snippet detail()}
    <Select
      label="Location"
      value="docs"
      options={[
        { label: 'Documents', value: 'docs' },
        { label: 'Desktop', value: 'desktop' },
        { label: 'iCloud Drive', value: 'icloud' },
      ]}
    />
  {/snippet}
</DisclosureButton>
