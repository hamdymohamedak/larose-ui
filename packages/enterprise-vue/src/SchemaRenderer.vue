<script setup lang="ts">
import { Form } from '@larose-ui/forms-vue';
import { Can } from '@larose-ui/permissions-vue';
import { Alert } from '@larose-ui/vue';
import { compileFormSchema, validateUISchema, type UISchema } from '@larose-ui/enterprise-core';
import { computed } from 'vue';

const props = defineProps<{
  schema: UISchema;
}>();

const emit = defineEmits<{ submit: [values: Record<string, string>] }>();

const errors = computed(() => validateUISchema(props.schema));
const formSchema = computed(() =>
  props.schema.type === 'form' ? compileFormSchema(props.schema) : null,
);
</script>

<template>
  <Alert v-if="errors.length > 0" variant="error" title="Invalid UI schema">
    <ul style="margin: 0; padding-inline-start: 1.25rem">
      <li v-for="e in errors" :key="e">{{ e }}</li>
    </ul>
  </Alert>
  <Alert
    v-else-if="schema.type !== 'form'"
    variant="info"
    title="Schema type not rendered"
  >
    Page and table schemas are composed at the app layer. Use compileFormSchema for forms.
  </Alert>
  <Can
    v-else-if="schema.permission && formSchema"
    :permission="schema.permission"
    fallback="forbidden"
  >
    <Form
      :schema="formSchema"
      :submit-url="schema.submitUrl"
      submit-label="Save"
      @submit="emit('submit', $event)"
    />
  </Can>
  <Form
    v-else-if="formSchema"
    :schema="formSchema"
    :submit-url="schema.submitUrl"
    submit-label="Save"
    @submit="emit('submit', $event)"
  />
</template>
