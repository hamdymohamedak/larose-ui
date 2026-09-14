<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, shallowRef, watch, type CSSProperties } from 'vue';
import { Teleport } from 'vue';
import { activateOverlayFocus } from '@larose-ui/primitives';
import {
  createPresenceController,
  MODAL_ARIA_IDS,
  presenceMotionClassKey,
  shouldDismissOnOverlayClick,
  type PresencePhase,
} from '@larose-ui/component-logic/overlay';
import styles from '@larose-ui/styles/components/Modal/Modal.module.css';
import motionStyles from '@larose-ui/styles/components/Motion/motion.module.css';
import { cn } from '../../utils/cn';
import { useComponentDefaults } from '../../composables/useComponentDefaults';

const props = withDefaults(
  defineProps<{
    open: boolean;
    title?: string;
    description?: string;
    closeOnOverlay?: boolean;
    class?: string;
    style?: CSSProperties;
    overlayClass?: string;
    contentClass?: string;
  }>(),
  {
    closeOnOverlay: true,
  },
);

const merged = computed(() => useComponentDefaults('Modal', props));
const emit = defineEmits<{ close: [] }>();

const dialogRef = ref<HTMLDivElement | null>(null);
const controller = createPresenceController(props.open);
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

function onClose() {
  emit('close');
}

function onOverlayClick(event: MouseEvent) {
  if (
    shouldDismissOnOverlayClick({
      closeOnOverlay: merged.value.closeOnOverlay,
      eventTarget: event.target,
      currentTarget: event.currentTarget,
    })
  ) {
    onClose();
  }
}

function onAnimationEnd(event: AnimationEvent) {
  if (event.target !== event.currentTarget) return;
  controller.handleAnimationEnd();
}

watch(
  () => merged.value.open,
  (open) => {
    controller.setPresent(open);
  },
  { immediate: true },
);

watch(
  () => merged.value.open,
  async (open, _prev, onCleanup) => {
    if (!open) return;
    await nextTick();
    const deactivate = activateOverlayFocus({
      container: dialogRef.value,
      onEscape: onClose,
    });
    onCleanup(() => deactivate());
  },
);

const backdropClass = computed(() => {
  const key = presenceMotionClassKey('backdrop', phase.value);
  return cn(
    styles.overlay,
    merged.value.overlayClass,
    key ? motionStyles[key as keyof typeof motionStyles] : undefined,
  );
});

const modalClass = computed(() => {
  const key = presenceMotionClassKey('modal', phase.value);
  return cn(
    styles.modal,
    merged.value.contentClass,
    merged.value.class,
    key ? motionStyles[key as keyof typeof motionStyles] : undefined,
  );
});
</script>

<template>
  <Teleport v-if="shouldRender" to="[data-lr-portal-root], [data-lr-provider], body">
    <div
      :class="backdropClass"
      :data-presence="phase"
      role="presentation"
      @click="onOverlayClick"
      @animationend="onAnimationEnd"
    >
      <div
        ref="dialogRef"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="merged.title ? MODAL_ARIA_IDS.titleId : undefined"
        :aria-describedby="merged.description ? MODAL_ARIA_IDS.descriptionId : undefined"
        :class="modalClass"
        :style="merged.style"
        :data-presence="phase"
        @animationend="onAnimationEnd"
      >
        <h2 v-if="merged.title" :id="MODAL_ARIA_IDS.titleId" :class="styles.title">
          {{ merged.title }}
        </h2>
        <p
          v-if="merged.description"
          :id="MODAL_ARIA_IDS.descriptionId"
          :class="styles.description"
        >
          {{ merged.description }}
        </p>
        <div :class="styles.content">
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>
