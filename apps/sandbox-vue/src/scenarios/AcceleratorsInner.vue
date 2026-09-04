<script setup lang="ts">
import { ref } from 'vue';
import { useAccelerator } from '@larose-ui/vue';

const last = ref('none');

useAccelerator(
  { key: 'j', mod: true, shift: true },
  () => {
    last.value = 'mod+shift+j';
  },
  { id: 'sandbox-accelerator-j', allowInEditable: true },
);
</script>

<template>
  <div class="sbx-stage-pad sbx-stack">
    <p class="sbx-muted">
      Press <kbd>⌘⇧J</kbd> / <kbd>Ctrl+Shift+J</kbd> to fire the sandbox accelerator.
    </p>
    <p data-sbx="accelerator-status">Last accelerator: {{ last }}</p>
  </div>
</template>
