<script lang="ts">
  import { getToast } from '@larose-ui/runtime-svelte/toast';

  const { toast } = getToast();
</script>

<div class="sbx-stage-pad sbx-stack">
  <p class="sbx-muted">Triggers a success toast via the runtime toast provider.</p>
  <button
    type="button"
    data-sbx="show-toast"
    onclick={() => toast({ title: 'Saved', message: 'Toast parity check.', variant: 'success' })}
  >
    Show toast
  </button>
</div>
