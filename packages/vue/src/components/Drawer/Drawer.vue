<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import type { CSSProperties } from 'vue';
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
let previousFocus: HTMLElement | null = null;

function onClose() {
  emit('close');
}

function onOverlayClick(event: MouseEvent) {
  if (merged.closeOnOverlay && event.target === event.currentTarget) {
    onClose();
  }
}

function onKeyDown(event: KeyboardEvent) {
  if (event.key === 'Escape' && merged.open) onClose();
}

watch(
  () => merged.open,
  (open) => {
    if (open) {
      previousFocus = document.activeElement as HTMLElement;
      requestAnimationFrame(() => panelRef.value?.focus());
      document.body.style.overflow = 'hidden';
      return;
    }
    document.body.style.overflow = '';
    previousFocus?.focus();
  },
  { immediate: true },
);

onMounted(() => {
  document.addEventListener('keydown', onKeyDown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', onKeyDown);
  document.body.style.overflow = '';
});
</script>

<template>
  <Teleport v-if="merged.open" to="body">
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
