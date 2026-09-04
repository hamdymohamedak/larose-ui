<script lang="ts">
  import { LaRoseProvider } from '@larose-ui/runtime-svelte';
  import CommandInner from './CommandInner.svelte';
</script>

<LaRoseProvider theme="light" locale="en" tenantId="sandbox" enableToasts={true}>
  <CommandInner />
</LaRoseProvider>
