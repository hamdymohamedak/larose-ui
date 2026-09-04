<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import type { DragItem, DropResult } from '../../DragDrop/types';
import { useDragDropContext } from '../../DragDrop/context';
import styles from '@larose-ui/styles/components/DragDrop/DragDrop.module.css';
import { cn } from '../../utils/cn';

const props = withDefaults(
  defineProps<{
    id: string;
    accepts?: string | string[];
    disabled?: boolean;
    canDrop?: (items: DragItem[]) => boolean;
    transferring?: boolean;
    transferringLabel?: string;
    showInvalidIndicator?: boolean;
    class?: string;
    style?: Record<string, string | number>;
  }>(),
  {
    disabled: false,
    transferring: false,
    transferringLabel: 'Transferring…',
    showInvalidIndicator: true,
  },
);

const emit = defineEmits<{ drop: [DropResult] }>();
const { session, target, registerZone } = useDragDropContext();
const el = ref<HTMLElement | null>(null);

watchEffect((onCleanup) => {
  if (!el.value) return;
  onCleanup(
    registerZone({
      id: props.id,
      accepts: props.accepts,
      canDrop: props.canDrop,
      onDrop: (result) => emit('drop', result),
      element: el.value,
    }),
  );
});

const state = computed(() => {
  if (target.value?.zoneId !== props.id) return 'idle';
  return target.value.valid ? 'active' : 'invalid';
});

const isActive = computed(() => state.value === 'active');
</script>

<template>
  <div
    ref="el"
    :class="cn(styles.dropZone, props.class)"
    :style="props.style"
    :data-state="state"
    :data-disabled="disabled ? 'true' : undefined"
    :aria-dropeffect="disabled ? 'none' : isActive ? 'move' : undefined"
  >
    <div v-if="transferring" :class="styles.placeholder" role="status">
      {{ transferringLabel }}
    </div>
    <slot v-else />
    <div
      v-if="state === 'invalid' && showInvalidIndicator && session"
      :class="styles.invalidIcon"
      aria-hidden="true"
    >
      ⊘
    </div>
  </div>
</template>
