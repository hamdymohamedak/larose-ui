<script setup lang="ts">
import { provide, ref } from 'vue';
import styles from '@larose-ui/styles/components/Toast/Toast.module.css';
import { cn } from '../../utils/cn';
import {
  toastInjectionKey,
  type ToastInput,
  type ToastPlacement,
} from '../../composables/useToast';

interface ToastRecord extends ToastInput {
  id: string;
}

withDefaults(
  defineProps<{
    placement?: ToastPlacement;
  }>(),
  {
    placement: 'bottom-right',
  },
);

const toasts = ref<ToastRecord[]>([]);

function removeToast(id: string) {
  toasts.value = toasts.value.filter((item) => item.id !== id);
}

function dismiss(id: string) {
  removeToast(id);
}

function toast(input: ToastInput) {
  const id = crypto.randomUUID();
  toasts.value = [...toasts.value, { ...input, id }];
  window.setTimeout(() => dismiss(id), input.duration ?? 5000);
  return id;
}

provide(toastInjectionKey, { toast, dismiss });
</script>

<template>
  <slot />
  <Teleport to="[data-lr-portal-root], [data-lr-provider], body">
    <div
      :class="styles.viewport"
      :data-placement="placement"
      aria-live="polite"
      aria-relevant="additions"
    >
      <div
        v-for="item in toasts"
        :key="item.id"
        :class="cn(styles.toast, item.class)"
        :style="item.style"
        :data-variant="item.variant ?? 'info'"
        :data-placement="placement"
        :role="(item.variant ?? 'info') === 'error' ? 'alert' : 'status'"
      >
        <div :class="styles.content">
          <strong v-if="item.title" :class="styles.title">{{ item.title }}</strong>
          <span :class="styles.message">{{ item.message }}</span>
        </div>
        <button
          type="button"
          :class="styles.dismiss"
          aria-label="Dismiss"
          @click="dismiss(item.id)"
        >
          ×
        </button>
      </div>
    </div>
  </Teleport>
</template>
