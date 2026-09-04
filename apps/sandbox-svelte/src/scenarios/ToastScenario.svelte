<script lang="ts">
  import { LaRoseProvider } from '@larose-ui/runtime-svelte';
  import ToastInner from './ToastInner.svelte';
</script>

<LaRoseProvider theme="light" locale="en" tenantId="sandbox" enableToasts={true}>
  <ToastInner />
</LaRoseProvider>
