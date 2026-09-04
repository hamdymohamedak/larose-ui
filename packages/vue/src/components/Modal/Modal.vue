<script setup lang="ts">
import { computed, ref, watch, type CSSProperties } from 'vue';
import { Teleport } from 'vue';
import { activateOverlayFocus } from '@larose-ui/primitives';
import styles from '@larose-ui/styles/components/Modal/Modal.module.css';
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

function onClose() {
  emit('close');
}

function onOverlayClick() {
  if (merged.value.closeOnOverlay !== false) onClose();
}

watch(
  () => merged.value.open,
  (open, _prev, onCleanup) => {
    if (!open) return;
    const deactivate = activateOverlayFocus({
      container: dialogRef.value,
      onEscape: onClose,
    });
    onCleanup(() => deactivate());
  },
);
</script>

<template>
  <Teleport v-if="merged.open" to="[data-lr-portal-root], [data-lr-provider], body">
    <div :class="cn(styles.overlay, merged.overlayClass)" @click.self="onOverlayClick">
      <div
        ref="dialogRef"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="merged.title ? 'larose-modal-title' : undefined"
        :aria-describedby="merged.description ? 'larose-modal-description' : undefined"
        :class="cn(styles.dialog, merged.class)"
        :style="merged.style"
      >
        <div :class="cn(styles.content, merged.contentClass)">
          <header v-if="merged.title || merged.description" :class="styles.header">
            <h2 v-if="merged.title" id="larose-modal-title" :class="styles.title">
              {{ merged.title }}
            </h2>
            <p v-if="merged.description" id="larose-modal-description" :class="styles.description">
              {{ merged.description }}
            </p>
          </header>
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>
