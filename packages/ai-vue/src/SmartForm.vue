<script setup lang="ts">
import { ref } from 'vue';
import { Form } from '@larose-ui/forms-vue';
import type { FormSchema, FormValues } from '@larose-ui/forms-core';
import { Input, Button } from '@larose-ui/vue';
import type { AIAdapter } from '@larose-ui/ai-core';
import { createMockAdapter } from '@larose-ui/ai-core';
import { useSmartAIRuntimeComputed } from './useSmartAIRuntime';
import styles from './SmartForm.module.css';

const props = withDefaults(
  defineProps<{
    schema: FormSchema;
    initialValues?: FormValues;
    submitUrl?: string;
    submitLabel?: string;
    adapter?: AIAdapter;
    promptPlaceholder?: string;
    writePermission?: string;
  }>(),
  {
    initialValues: () => ({}),
    adapter: () => createMockAdapter(),
    promptPlaceholder: 'Describe what to create… e.g. "Create employee for Ahmed Mohamed"',
    writePermission: 'employees.write',
    submitLabel: 'Save',
  },
);

const emit = defineEmits<{ submit: [values: FormValues] }>();

const runtime = useSmartAIRuntimeComputed(props.adapter);
const prompt = ref('');
const values = ref<FormValues>({ ...props.initialValues });
const explanation = ref<string | null>(null);
const denial = ref<string | null>(null);
const formKey = ref(0);

async function populate() {
  denial.value = null;
  const fields = props.schema.fields.map((f) => ({ name: f.name, label: f.label }));
  const execution = await runtime.value.populateForm(
    prompt.value,
    fields,
    props.writePermission,
  );

  if (!execution.allowed || !execution.result) {
    denial.value = execution.denialReason ?? 'Action not permitted';
    explanation.value = null;
    return;
  }

  values.value = { ...values.value, ...execution.result.values };
  explanation.value = execution.result.explanation;
  formKey.value += 1;
}
</script>

<template>
  <div :class="styles.wrapper" data-lr-smart-form data-lr-component="SmartForm">
    <div :class="styles.promptRow">
      <Input
        label="Smart populate"
        :placeholder="promptPlaceholder"
        :model-value="prompt"
        @update:model-value="prompt = $event"
        @keydown.enter="populate"
      />
      <Button variant="outline" @click="populate">Populate</Button>
    </div>
    <p v-if="denial" :class="styles.denial" data-lr-ai-denied role="alert">{{ denial }}</p>
    <p v-if="explanation && !denial" :class="styles.explanation">{{ explanation }}</p>
    <Form
      :key="formKey"
      :schema="schema"
      :initial-values="values"
      :submit-url="submitUrl"
      :submit-label="submitLabel"
      @submit="emit('submit', $event)"
    />
  </div>
</template>
