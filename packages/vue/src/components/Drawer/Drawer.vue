<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, shallowRef, watch, type CSSProperties } from 'vue';
import { Teleport } from 'vue';
import { activateOverlayFocus, focusFirst } from '@larose-ui/primitives';
import {
  createPresenceController,
  presenceMotionClassKey,
  shouldDismissOnOverlayClick,
  type PresencePhase,
} from '@larose-ui/component-logic/overlay';
import styles from '@larose-ui/styles/components/Drawer/Drawer.module.css';
import motionStyles from '@larose-ui/styles/components/Motion/motion.module.css';
import { cn } from '../../utils/cn';
import { useComponentDefaults } from '../../composables/useComponentDefaults';

export type DrawerSide = 'left' | 'right';

const props = withDefaults(
  defineProps<{
    open: boolean;
    title?: string;
    description?: string;
    side?: DrawerSide;
    closeOnOverlay?: boolean;
    class?: string;
    overlayClass?: string;
    panelClass?: string;
    style?: CSSProperties;
    overlayStyle?: CSSProperties;
    panelStyle?: CSSProperties;
  }>(),
  {
    side: 'right',
    closeOnOverlay: true,
  },
);

const merged = computed(() => useComponentDefaults('Drawer', props));
const emit = defineEmits<{ close: [] }>();

const panelRef = ref<HTMLElement | null>(null);
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
  (open) => controller.setPresent(open),
  { immediate: true },
);

watch(
  () => merged.value.open,
  async (open, _prev, onCleanup) => {
    if (!open) return;
    await nextTick();
    if (!focusFirst(panelRef.value)) {
      panelRef.value?.focus();
    }
    const deactivate = activateOverlayFocus({
      container: panelRef.value,
      onEscape: onClose,
      autoFocus: false,
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

const panelClass = computed(() => {
  const kind = (merged.value.side ?? 'right') === 'right' ? 'drawer-right' : 'drawer-left';
  const key = presenceMotionClassKey(kind, phase.value);
  return cn(
    styles.panel,
    merged.value.panelClass,
    merged.value.class,
    key ? motionStyles[key as keyof typeof motionStyles] : undefined,
  );
});
</script>

<template>
  <Teleport v-if="shouldRender" to="[data-lr-portal-root], [data-lr-provider], body">
    <div
      :class="backdropClass"
      :style="{ ...merged.overlayStyle, ...merged.style }"
      :data-presence="phase"
      role="presentation"
      @click="onOverlayClick"
      @animationend="onAnimationEnd"
    >
      <aside
        ref="panelRef"
        :class="panelClass"
        :style="merged.panelStyle"
        :data-side="merged.side"
        :data-presence="phase"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="merged.title ? 'lr-drawer-title' : undefined"
        :aria-describedby="merged.description ? 'lr-drawer-desc' : undefined"
        tabindex="-1"
        @animationend="onAnimationEnd"
      >
        <h2 v-if="merged.title" id="lr-drawer-title" :class="styles.title">
          {{ merged.title }}
        </h2>
        <p v-if="merged.description" id="lr-drawer-desc" :class="styles.description">
          {{ merged.description }}
        </p>
        <div :class="styles.content">
          <slot />
        </div>
      </aside>
    </div>
  </Teleport>
</template>
