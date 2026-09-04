<script lang="ts">
  import { LaRoseProvider } from '@larose-ui/runtime-svelte';
  import { Modal } from '@larose-ui/svelte';

  let open = $state(false);
</script>

<LaRoseProvider theme="light" locale="en" tenantId="sandbox">
  <div class="sbx-stage-pad sbx-stack">
    <p class="sbx-muted">Modal portal + focus trap. Escape or Close dismisses.</p>
    <button type="button" data-sbx="open-modal" onclick={() => (open = true)}>Open modal</button>
    <Modal
      {open}
      title="Confirm action"
      description="Sandbox overlay scenario."
      onclose={() => (open = false)}
    >
      <p class="sbx-muted">Focus should stay inside the dialog while open.</p>
      <button type="button" data-sbx="close-modal" onclick={() => (open = false)}>Close</button>
    </Modal>
  </div>
</LaRoseProvider>
