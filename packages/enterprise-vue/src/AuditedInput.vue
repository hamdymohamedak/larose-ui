<script setup lang="ts">
import { ref } from 'vue';
import { Input } from '@larose-ui/vue';
import { useOptionalObservability } from '@larose-ui/observability-vue';
import { useOptionalAudit } from './context';
import AuditHistory from './AuditHistory.vue';
import styles from './AuditedInput.module.css';

const props = withDefaults(
  defineProps<{
    field: string;
    resourceId?: string;
    showHistory?: boolean;
    modelValue?: string;
    label?: string;
    placeholder?: string;
    type?: string;
  }>(),
  {
    showHistory: true,
    modelValue: '',
    type: 'text',
  },
);

const emit = defineEmits<{ 'update:modelValue': [value: string] }>();

const audit = useOptionalAudit();
const observability = useOptionalObservability();
const historyOpen = ref(false);

function handleChange(next: string) {
  const previous = props.modelValue ?? '';
  if (audit && previous !== next) {
    audit.recordChange({
      field: props.field,
      before: previous,
      after: next,
      resourceId: props.resourceId,
    });
  }
  observability?.track({
    type: 'interaction',
    component: 'AuditedInput',
    metadata: { field: props.field, resourceId: props.resourceId, action: 'change' },
  });
  emit('update:modelValue', next);
}
</script>

<template>
  <div :class="styles.wrapper" :data-lr-audited-field="field">
    <Input
      :label="label"
      :type="type"
      :placeholder="placeholder"
      :model-value="modelValue"
      @update:model-value="handleChange"
    />
    <template v-if="showHistory && audit">
      <button
        type="button"
        :class="styles.historyButton"
        @click="historyOpen = !historyOpen"
      >
        View History
      </button>
      <AuditHistory
        v-if="historyOpen"
        :field="field"
        :resource-id="resourceId"
        @close="historyOpen = false"
      />
    </template>
  </div>
</template>
