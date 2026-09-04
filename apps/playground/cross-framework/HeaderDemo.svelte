<script lang="ts">
  import Header from '../../../packages/svelte/src/lib/components/Header/Header.svelte';
  import HeaderBrand from '../../../packages/svelte/src/lib/components/Header/HeaderBrand.svelte';
  import HeaderTitle from '../../../packages/svelte/src/lib/components/Header/HeaderTitle.svelte';
  import HeaderActions from '../../../packages/svelte/src/lib/components/Header/HeaderActions.svelte';

  let {
    title = 'Employees',
    brand = 'laRose',
  }: { title?: string; brand?: string } = $props();
</script>

<Header>
  <HeaderBrand>{brand}</HeaderBrand>
  <HeaderTitle>{title}</HeaderTitle>
  <HeaderActions>
    <button type="button">Action</button>
  </HeaderActions>
</Header>
