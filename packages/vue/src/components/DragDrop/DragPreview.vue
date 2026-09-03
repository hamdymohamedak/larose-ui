<script setup lang="ts">
import type { DragSession } from '../../DragDrop/types';
import styles from '@larose-ui/styles/components/DragDrop/DragDrop.module.css';

defineProps<{
  session: DragSession | null;
  revert: boolean;
}>();
</script>

<template>
  <Teleport to="body">
    <div v-if="session" :class="styles.previewLayer" aria-hidden="true">
      <div
        :class="styles.preview"
        :data-revert="revert ? 'true' : undefined"
        :style="{
          left: `${session.x}px`,
          top: `${session.y}px`,
          transform: revert ? 'translate(-50%, -50%) scale(0.85)' : 'translate(-50%, -50%)',
        }"
      >
        {{ session.items[0]?.label ?? 'Dragging…' }}
        <span v-if="session.items.length > 1" :class="styles.badge">{{ session.items.length }}</span>
      </div>
    </div>
  </Teleport>
</template>
