<script setup lang="ts">
import { ref } from 'vue';
import { LaRoseProvider } from '@larose-ui/runtime-vue';
import { Modal } from '@larose-ui/vue';

const open = ref(false);
</script>

<template>
  <LaRoseProvider theme="light" locale="en" tenant-id="sandbox">
    <div class="sbx-stage-pad sbx-stack">
      <p class="sbx-muted">Modal portal + focus trap. Escape or Close dismisses.</p>
      <button type="button" data-sbx="open-modal" @click="open = true">Open modal</button>
      <Modal
        :open="open"
        title="Confirm action"
        description="Sandbox overlay scenario."
        @close="open = false"
      >
        <p class="sbx-muted">Focus should stay inside the dialog while open.</p>
        <button type="button" data-sbx="close-modal" @click="open = false">Close</button>
      </Modal>
    </div>
  </LaRoseProvider>
</template>
