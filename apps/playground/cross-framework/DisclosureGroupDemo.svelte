<script lang="ts">
  import DisclosureTriangle from '../../../packages/svelte/src/lib/components/Disclosure/DisclosureTriangle.svelte';
  import Input from '../../../packages/svelte/src/lib/components/Input/Input.svelte';

  interface Props {
    label?: string;
    defaultExpanded?: boolean;
  }

  let { label = 'Delivery details', defaultExpanded = true }: Props = $props();
</script>

<DisclosureTriangle {label} {defaultExpanded}>
  <Input label="Recipient" value="sara@company.com" />
  <Input label="Notes" value="Leave at front desk" />
</DisclosureTriangle>
