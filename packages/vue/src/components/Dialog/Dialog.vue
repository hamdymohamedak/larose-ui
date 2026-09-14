<script setup lang="ts">
import { computed } from 'vue';
import { resolveDialogConfirmVisibility } from '@larose-ui/component-logic/overlay';
import styles from '@larose-ui/styles/components/Dialog/Dialog.module.css';
import Modal from '../Modal/Modal.vue';
import Button from '../Button/Button.vue';

const props = withDefaults(
  defineProps<{
    open: boolean;
    title: string;
    description?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    loading?: boolean;
    variant?: 'default' | 'destructive';
    showConfirm?: boolean;
  }>(),
  {
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    variant: 'default',
    showConfirm: true,
  },
);

const emit = defineEmits<{
  close: [];
  confirm: [];
}>();

const confirmVisible = computed(() =>
  resolveDialogConfirmVisibility({ showConfirm: props.showConfirm, hasConfirmHandler: true }),
);
</script>

<template>
  <Modal :open="open" :title="title" :description="description" @close="emit('close')">
    <div v-if="$slots.default" :class="styles.body">
      <slot />
    </div>
    <div :class="styles.actions">
      <Button
        button-role="cancel"
        variant="secondary"
        :disabled="loading"
        @click="emit('close')"
      >
        {{ cancelLabel }}
      </Button>
      <Button
        v-if="confirmVisible"
        :variant="variant === 'destructive' ? 'ghost' : 'primary'"
        :button-role="variant === 'destructive' ? 'destructive' : 'primary'"
        :loading="loading"
        @click="emit('confirm')"
      >
        {{ confirmLabel }}
      </Button>
    </div>
  </Modal>
</template>
