<script setup lang="ts">
import type { UndoAction } from '@larose-ui/data-core';

defineProps<{
  actions: UndoAction[];
}>();

const emit = defineEmits<{
  undo: [id: string];
  dismiss: [id: string];
}>();
</script>

<template>
  <div
    v-if="actions.length > 0"
    style="
      position: fixed;
      bottom: var(--lr-space-6);
      right: var(--lr-space-6);
      display: flex;
      flex-direction: column;
      gap: var(--lr-space-2);
      z-index: 1100;
    "
  >
    <div
      v-for="action in actions"
      :key="action.id"
      role="status"
      style="
        display: flex;
        align-items: center;
        gap: var(--lr-space-3);
        padding: var(--lr-space-3) var(--lr-space-4);
        background: var(--lr-color-surface-elevated);
        border: 1px solid var(--lr-color-border);
        border-radius: var(--lr-radius-md);
        box-shadow: var(--lr-shadow-md);
      "
    >
      <span style="font-size: var(--lr-font-size-sm)">{{ action.label }}</span>
      <button type="button" style="font-weight: 600" @click="emit('undo', action.id)">
        Undo
      </button>
      <button type="button" aria-label="Dismiss" @click="emit('dismiss', action.id)">
        ×
      </button>
    </div>
  </div>
</template>
