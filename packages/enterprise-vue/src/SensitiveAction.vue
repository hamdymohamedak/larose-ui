<script setup lang="ts">
import { ref } from 'vue';
import { Dialog, Button } from '@larose-ui/vue';
import { useEnvironment } from '@larose-ui/runtime-vue';
import { useOptionalObservability } from '@larose-ui/observability-vue';

const props = withDefaults(
  defineProps<{
    label: string;
    description?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    requireProductionConfirm?: boolean;
  }>(),
  {
    description: 'This action may have irreversible consequences.',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    requireProductionConfirm: true,
  },
);

const emit = defineEmits<{ confirm: [] }>();

const open = ref(false);
const busy = ref(false);
const environment = useEnvironment();
const observability = useOptionalObservability();
const isProduction = environment === 'production';

async function handleConfirm() {
  busy.value = true;
  try {
    observability?.track({
      type: 'interaction',
      component: 'SensitiveAction',
      metadata: { label: props.label, environment },
    });
    emit('confirm');
    open.value = false;
  } finally {
    busy.value = false;
  }
}
</script>

<template>
  <Button variant="destructive" @click="open = true">{{ label }}</Button>
  <Dialog
    :open="open"
    :title="label"
    :description="
      isProduction && requireProductionConfirm
        ? `${description} You are in production.`
        : description
    "
    :confirm-label="confirmLabel"
    :cancel-label="cancelLabel"
    :loading="busy"
    variant="destructive"
    @close="open = false"
    @confirm="handleConfirm"
  />
</template>
