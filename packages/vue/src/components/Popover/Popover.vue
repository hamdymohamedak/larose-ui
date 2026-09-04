<script setup lang="ts">
import { computed, ref, useId, watch } from 'vue';
import type { CSSProperties } from 'vue';
import { activateOverlayFocus } from '@larose-ui/primitives';
import styles from '@larose-ui/styles/components/Popover/Popover.module.css';
import { cn } from '../../utils/cn';

export type PopoverSide = 'top' | 'bottom' | 'left' | 'right';

const props = withDefaults(
  defineProps<{
    open?: boolean;
    defaultOpen?: boolean;
    side?: PopoverSide;
    panelClass?: string;
    class?: string;
    style?: CSSProperties;
    ariaLabel?: string;
  }>(),
  {
    defaultOpen: false,
    side: 'bottom',
    ariaLabel: 'Popover',
  },
);

const emit = defineEmits<{
  openChange: [open: boolean];
}>();

const internalOpen = ref(props.defaultOpen);
const isControlled = computed(() => props.open !== undefined);
const isOpen = computed(() => (isControlled.value ? Boolean(props.open) : internalOpen.value));
const popoverId = useId();
const rootRef = ref<HTMLElement | null>(null);
const panelRef = ref<HTMLElement | null>(null);

function setOpen(next: boolean) {
  if (!isControlled.value) internalOpen.value = next;
  emit('openChange', next);
}

function onPointerDown(event: MouseEvent) {
  if (!rootRef.value?.contains(event.target as Node)) {
    setOpen(false);
  }
}

watch(
  isOpen,
  (open, _prev, onCleanup) => {
    if (!open) return;
    document.addEventListener('mousedown', onPointerDown);
    let deactivate: (() => void) | null = null;
    const frame = requestAnimationFrame(() => {
      deactivate = activateOverlayFocus({
        container: panelRef.value,
        onEscape: () => setOpen(false),
        lockScroll: false,
      });
    });
    onCleanup(() => {
      document.removeEventListener('mousedown', onPointerDown);
      cancelAnimationFrame(frame);
      deactivate?.();
    });
  },
  { immediate: true },
);
</script>

<template>
  <span ref="rootRef" :class="cn(styles.wrapper, $props.class)" :style="style">
    <span
      :aria-expanded="isOpen"
      :aria-controls="isOpen ? popoverId : undefined"
      @click="setOpen(!isOpen)"
    >
      <slot name="trigger" />
    </span>
    <div
      v-if="isOpen"
      ref="panelRef"
      :id="popoverId"
      role="dialog"
      :aria-label="ariaLabel"
      :class="cn(styles.popover, panelClass)"
      :data-side="side"
    >
      <slot name="content" />
    </div>
  </span>
</template>
