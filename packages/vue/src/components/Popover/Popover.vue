<script setup lang="ts">
import { computed, onUnmounted, ref, useId, watch } from 'vue';
import type { CSSProperties } from 'vue';
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

function setOpen(next: boolean) {
  if (!isControlled.value) internalOpen.value = next;
  emit('openChange', next);
}

function onPointerDown(event: MouseEvent) {
  if (!rootRef.value?.contains(event.target as Node)) {
    setOpen(false);
  }
}

function onKeyDown(event: KeyboardEvent) {
  if (event.key === 'Escape') setOpen(false);
}

watch(
  isOpen,
  (open) => {
    if (!open) {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
      return;
    }
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
  },
  { immediate: true },
);

onUnmounted(() => {
  document.removeEventListener('mousedown', onPointerDown);
  document.removeEventListener('keydown', onKeyDown);
});
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
