<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { Teleport } from 'vue';
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
    overlayClass?: string;
    contentClass?: string;
  }>(),
  {
    closeOnOverlay: true,
  },
);

const merged = useComponentDefaults('Modal', props);
const emit = defineEmits<{ close: [] }>();

const dialogRef = ref<HTMLDivElement | null>(null);
let previousFocus: HTMLElement | null = null;

function onClose() {
  emit('close');
}

function onOverlayClick() {
  if (merged.closeOnOverlay) onClose();
}

function onKeyDown(event: KeyboardEvent) {
  if (event.key === 'Escape') onClose();
}

watch(
  () => merged.open,
  (open) => {
    if (!open) return;
    previousFocus = document.activeElement as HTMLElement;
    requestAnimationFrame(() => {
      const focusable = dialogRef.value?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      focusable?.focus();
    });
    document.body.style.overflow = 'hidden';
  },
  { immediate: true },
);

onMounted(() => {
  document.addEventListener('keydown', onKeyDown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', onKeyDown);
  document.body.style.overflow = '';
  previousFocus?.focus();
});
</script>

<template>
  <Teleport v-if="merged.open" to="body">
    <div :class="cn(styles.overlay, merged.overlayClass)" @click.self="onOverlayClick">
      <div
        ref="dialogRef"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="merged.title ? 'larose-modal-title' : undefined"
        :aria-describedby="merged.description ? 'larose-modal-description' : undefined"
        :class="cn(styles.dialog, merged.class)"
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
