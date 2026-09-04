<script setup lang="ts">
import { computed, ref } from 'vue';
import { Alert, Button, Input, Select, Textarea } from '@larose-ui/vue';
import {
  getVisibleFields,
  validateForm,
  type FormSchema,
  type FormValues,
} from '@larose-ui/forms-core';
import {
  apiFetch,
  isApiError,
  type ApiFetchOptions,
} from '@larose-ui/data-core';
import {
  useOptionalObservability,
  markFormSubmitted,
  trackFormSuccess,
  trackFormError,
  trackFormValidationFailed,
} from '@larose-ui/observability-vue';
import type { ApiError } from '@larose-ui/core';
import styles from './Form.module.css';

const props = withDefaults(
  defineProps<{
    schema: FormSchema;
    initialValues?: FormValues;
    submitUrl?: string;
    submitLabel?: string;
  }>(),
  {
    initialValues: () => ({}),
    submitLabel: 'Save',
  },
);

const emit = defineEmits<{
  submit: [values: FormValues];
}>();

const values = ref<FormValues>({ ...props.initialValues });
const errors = ref<Record<string, string>>({});
const touched = ref<Record<string, boolean>>({});
const submitting = ref(false);
const serverError = ref<ApiError | null>(null);
const observability = useOptionalObservability();
const formName = computed(() => props.schema.id);

const visibleFields = computed(() => getVisibleFields(props.schema, values.value));

function handleChange(name: string, value: string) {
  values.value = { ...values.value, [name]: value };
  touched.value = { ...touched.value, [name]: true };
}

async function handleSubmit(event: Event) {
  event.preventDefault();
  const validationErrors = validateForm(props.schema, values.value);
  errors.value = validationErrors;
  if (Object.keys(validationErrors).length > 0) {
    if (observability) {
      trackFormValidationFailed(
        formName.value,
        observability.track,
        Object.keys(validationErrors),
      );
    }
    return;
  }

  if (observability) {
    markFormSubmitted(formName.value, observability.track);
  }

  submitting.value = true;
  serverError.value = null;
  try {
    if (props.submitUrl) {
      await apiFetch(props.submitUrl, {
        method: 'POST',
        body: JSON.stringify(values.value),
      } satisfies ApiFetchOptions);
    }
    emit('submit', values.value);
    if (observability) {
      trackFormSuccess(formName.value, observability.track);
    }
  } catch (err) {
    serverError.value = isApiError(err)
      ? err.apiError
      : { code: 500, message: 'Submit failed', retryable: true };
    if (observability) {
      trackFormError(
        formName.value,
        observability.track,
        serverError.value.message,
      );
    }
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <form :class="styles.form" :data-form-id="schema.id" @submit="handleSubmit">
    <h2 v-if="schema.title" :class="styles.title">{{ schema.title }}</h2>

    <Alert v-if="serverError" variant="error" title="Save failed">
      {{ serverError.message }}
    </Alert>

    <div v-for="field in visibleFields" :key="field.name">
      <Select
        v-if="field.type === 'select'"
        :label="field.label"
        :model-value="values[field.name] ?? ''"
        :options="field.options ?? []"
        :error="touched[field.name] ? errors[field.name] : undefined"
        @update:model-value="handleChange(field.name, $event)"
      />
      <Textarea
        v-else-if="field.type === 'textarea'"
        :label="field.label"
        :model-value="values[field.name] ?? ''"
        :placeholder="field.placeholder"
        :hint="field.hint"
        :error="touched[field.name] ? errors[field.name] : undefined"
        @update:model-value="handleChange(field.name, $event)"
      />
      <Input
        v-else
        :label="field.label"
        :type="field.type === 'number' ? 'number' : field.type"
        :model-value="values[field.name] ?? ''"
        :placeholder="field.placeholder"
        :hint="field.hint"
        :error="touched[field.name] ? errors[field.name] : undefined"
        @update:model-value="handleChange(field.name, $event)"
      />
    </div>

    <div :class="styles.actions">
      <Button type="submit" :loading="submitting">{{ submitLabel }}</Button>
    </div>
  </form>
</template>
