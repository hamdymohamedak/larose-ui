<script lang="ts">
  import { LaRoseProvider } from '@larose-ui/runtime-svelte';
  import AcceleratorsInner from './AcceleratorsInner.svelte';
</script>

<LaRoseProvider theme="light" locale="en" tenantId="sandbox">
  <AcceleratorsInner />
</LaRoseProvider>
