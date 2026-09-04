<script setup lang="ts">
import { ref, watch } from 'vue';
import type { CSSProperties } from 'vue';
import { activateOverlayFocus, focusFirst } from '@larose-ui/primitives';
import styles from '@larose-ui/styles/components/Drawer/Drawer.module.css';
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

const merged = useComponentDefaults('Drawer', props);
const emit = defineEmits<{ close: [] }>();

const panelRef = ref<HTMLElement | null>(null);

function onClose() {
  emit('close');
}

function onOverlayClick(event: MouseEvent) {
  if (merged.closeOnOverlay && event.target === event.currentTarget) {
    onClose();
  }
}

watch(
  () => merged.open,
  (open, _prev, onCleanup) => {
    if (!open) return;
    let deactivate: (() => void) | null = null;
    const frame = requestAnimationFrame(() => {
      if (!focusFirst(panelRef.value)) {
        panelRef.value?.focus();
      }
      deactivate = activateOverlayFocus({
        container: panelRef.value,
        onEscape: onClose,
        autoFocus: false,
      });
    });
    onCleanup(() => {
      cancelAnimationFrame(frame);
      deactivate?.();
    });
  },
  { immediate: true },
);
</script>

<template>
  <Teleport v-if="merged.open" to="[data-lr-portal-root], [data-lr-provider], body">
    <div
      :class="cn(styles.overlay, merged.overlayClass)"
      :style="{ ...merged.overlayStyle, ...merged.style }"
      role="presentation"
      @click="onOverlayClick"
    >
      <aside
        ref="panelRef"
        :class="cn(styles.panel, merged.panelClass, merged.class)"
        :style="merged.panelStyle"
        :data-side="merged.side"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="merged.title ? 'lr-drawer-title' : undefined"
        :aria-describedby="merged.description ? 'lr-drawer-desc' : undefined"
        tabindex="-1"
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
