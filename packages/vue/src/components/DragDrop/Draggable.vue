<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { DRAG_START_THRESHOLD_PX } from '@larose-ui/tokens';
import { shouldBeginDrag } from '@larose-ui/primitives';
import { useDragDropContext } from '../../DragDrop/context';
import styles from '@larose-ui/styles/components/DragDrop/DragDrop.module.css';
import { cn } from '../../utils/cn';

const props = withDefaults(
  defineProps<{
    id: string;
    sourceId: string;
    data: unknown;
    type?: string;
    label?: string;
    disabled?: boolean;
    class?: string;
    style?: Record<string, string | number>;
  }>(),
  { disabled: false },
);

const {
  session,
  beginPointerDrag,
  addItemToSession,
  updatePointer,
  endPointer,
} = useDragDropContext();

const elRef = ref<HTMLElement | null>(null);
const pending = ref(false);
const origin = ref<{ x: number; y: number; pointerId: number } | null>(null);
const isDragging = computed(
  () => session.value?.items.some((item) => item.id === props.id) ?? false,
);

watch(session, (next) => {
  if (!next) {
    pending.value = false;
    origin.value = null;
  }
});

function buildItem() {
  return {
    id: props.id,
    sourceId: props.sourceId,
    data: props.data,
    type: props.type,
    label: props.label,
  };
}

function onPointerDown(event: PointerEvent) {
  if (props.disabled || event.button !== 0) return;
  origin.value = {
    x: event.clientX,
    y: event.clientY,
    pointerId: event.pointerId,
  };
  pending.value = true;
  elRef.value?.setPointerCapture(event.pointerId);
}

function onPointerMove(event: PointerEvent) {
  if (!pending.value || !origin.value) return;
  if (event.pointerId !== origin.value.pointerId) return;

  if (
    !session.value &&
    shouldBeginDrag(
      origin.value.x,
      origin.value.y,
      event.clientX,
      event.clientY,
      DRAG_START_THRESHOLD_PX,
    )
  ) {
    beginPointerDrag(
      buildItem(),
      event.pointerId,
      event.clientX,
      event.clientY,
      elRef.value ?? undefined,
    );
    pending.value = false;
    return;
  }

  if (session.value && session.value.pointerId === event.pointerId) {
    updatePointer(event.clientX, event.clientY);
  }
}

function onPointerUp(event: PointerEvent) {
  if (session.value && session.value.pointerId === event.pointerId) {
    void endPointer(event.clientX, event.clientY, event.altKey);
  }
  if (pending.value && session.value && event.shiftKey) {
    addItemToSession(buildItem());
  }
  pending.value = false;
  origin.value = null;
}
</script>

<template>
  <div
    ref="elRef"
    :class="cn(styles.draggable, props.class)"
    :style="props.style"
    :data-dragging="isDragging ? 'true' : undefined"
    :data-disabled="disabled ? 'true' : undefined"
    :aria-grabbed="isDragging ? true : undefined"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
  >
    <slot />
  </div>
</template>
