<script setup lang="ts">
import { useToast } from '@larose-ui/runtime-vue/toast';

const { toast } = useToast();
</script>

<template>
  <div class="sbx-stage-pad sbx-stack">
    <p class="sbx-muted">Triggers a success toast via the runtime toast provider.</p>
    <button
      type="button"
      data-sbx="show-toast"
      @click="toast({ title: 'Saved', message: 'Toast parity check.', variant: 'success' })"
    >
      Show toast
    </button>
  </div>
</template>
