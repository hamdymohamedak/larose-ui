<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, shallowRef, useId, watch } from 'vue';
import type { CSSProperties } from 'vue';
import { activateOverlayFocus } from '@larose-ui/primitives';
import {
  createPresenceController,
  presenceMotionClassKey,
  type PresencePhase,
} from '@larose-ui/component-logic/overlay';
import styles from '@larose-ui/styles/components/Popover/Popover.module.css';
import motionStyles from '@larose-ui/styles/components/Motion/motion.module.css';
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

const controller = createPresenceController(false);
const phase = shallowRef<PresencePhase>(controller.getSnapshot().phase);
const shouldRender = shallowRef(controller.getSnapshot().shouldRender);

const unsub = controller.subscribe(() => {
  const snap = controller.getSnapshot();
  phase.value = snap.phase;
  shouldRender.value = snap.shouldRender;
});

onBeforeUnmount(() => {
  unsub();
  controller.dispose();
});

function setOpen(next: boolean) {
  if (!isControlled.value) internalOpen.value = next;
  emit('openChange', next);
}

function onPointerDown(event: MouseEvent) {
  if (!rootRef.value?.contains(event.target as Node)) {
    setOpen(false);
  }
}

function onAnimationEnd(event: AnimationEvent) {
  if (event.target !== event.currentTarget) return;
  controller.handleAnimationEnd();
}

watch(
  isOpen,
  (open) => controller.setPresent(open),
  { immediate: true },
);

watch(
  isOpen,
  async (open, _prev, onCleanup) => {
    if (!open) return;
    document.addEventListener('mousedown', onPointerDown);
    await nextTick();
    const deactivate = activateOverlayFocus({
      container: panelRef.value,
      onEscape: () => setOpen(false),
      lockScroll: false,
    });
    onCleanup(() => {
      document.removeEventListener('mousedown', onPointerDown);
      deactivate();
    });
  },
);

const panelClassName = computed(() => {
  const key = presenceMotionClassKey('popover', phase.value);
  return cn(
    styles.popover,
    props.panelClass,
    key ? motionStyles[key as keyof typeof motionStyles] : undefined,
  );
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
      v-if="shouldRender"
      ref="panelRef"
      :id="popoverId"
      role="dialog"
      :aria-label="ariaLabel"
      :class="panelClassName"
      :data-side="side"
      :data-placement="side"
      :data-presence="phase"
      @animationend="onAnimationEnd"
    >
      <slot name="content" />
    </div>
  </span>
</template>
