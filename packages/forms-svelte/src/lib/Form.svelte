<script lang="ts">
  import { Alert, Button, Input, Select, Textarea } from '@larose-ui/svelte';
  import {
    getVisibleFields,
    validateForm,
    type FormSchema,
    type FormValues,
  } from '@larose-ui/forms-core';
  import { apiFetch, isApiError } from '@larose-ui/data-core';
  import {
    getOptionalObservabilityContext,
    markFormSubmitted,
    trackFormSuccess,
    trackFormError,
    trackFormValidationFailed,
  } from '@larose-ui/observability-svelte';
  import type { ApiError } from '@larose-ui/core';
  import styles from './Form.module.css';

  interface Props {
    schema: FormSchema;
    initialValues?: FormValues;
    submitUrl?: string;
    submitLabel?: string;
    onsubmit?: (values: FormValues) => void;
  }

  let {
    schema,
    initialValues = {},
    submitUrl,
    submitLabel = 'Save',
    onsubmit,
  }: Props = $props();

  let values = $state<FormValues>({ ...initialValues });
  let errors = $state<Record<string, string>>({});
  let touched = $state<Record<string, boolean>>({});
  let submitting = $state(false);
  let serverError = $state<ApiError | null>(null);

  const visibleFields = $derived(getVisibleFields(schema, values));
  const observability = getOptionalObservabilityContext();

  function handleChange(name: string, value: string) {
    values = { ...values, [name]: value };
    touched = { ...touched, [name]: true };
  }

  async function handleSubmit(event: Event) {
    event.preventDefault();
    const validationErrors = validateForm(schema, values);
    errors = validationErrors;
    if (Object.keys(validationErrors).length > 0) {
      if (observability) {
        trackFormValidationFailed(
          schema.id,
          observability.track,
          Object.keys(validationErrors),
        );
      }
      return;
    }

    if (observability) {
      markFormSubmitted(schema.id, observability.track);
    }

    submitting = true;
    serverError = null;
    try {
      if (submitUrl) {
        await apiFetch(submitUrl, {
          method: 'POST',
          body: JSON.stringify(values),
        });
      }
      onsubmit?.(values);
      if (observability) {
        trackFormSuccess(schema.id, observability.track);
      }
    } catch (err) {
      serverError = isApiError(err)
        ? err.apiError
        : { code: 500, message: 'Submit failed', retryable: true };
      if (observability) {
        trackFormError(schema.id, observability.track, serverError.message);
      }
    } finally {
      submitting = false;
    }
  }
</script>

<form class={styles.form} data-form-id={schema.id} onsubmit={handleSubmit}>
  {#if schema.title}
    <h2 class={styles.title}>{schema.title}</h2>
  {/if}

  {#if serverError}
    <Alert variant="error" title="Save failed">{serverError.message}</Alert>
  {/if}

  {#each visibleFields as field (field.name)}
    <div>
      {#if field.type === 'select'}
        <Select
          label={field.label}
          bind:value={
            () => values[field.name] ?? '',
            (v) => handleChange(field.name, v)
          }
          options={field.options ?? []}
          error={touched[field.name] ? errors[field.name] : undefined}
        />
      {:else if field.type === 'textarea'}
        <Textarea
          label={field.label}
          bind:value={
            () => values[field.name] ?? '',
            (v) => handleChange(field.name, v)
          }
          placeholder={field.placeholder}
          hint={field.hint}
          error={touched[field.name] ? errors[field.name] : undefined}
        />
      {:else}
        <Input
          label={field.label}
          type={field.type === 'number' ? 'number' : field.type}
          bind:value={
            () => values[field.name] ?? '',
            (v) => handleChange(field.name, v)
          }
          placeholder={field.placeholder}
          hint={field.hint}
          error={touched[field.name] ? errors[field.name] : undefined}
        />
      {/if}
    </div>
  {/each}

  <div class={styles.actions}>
    <Button type="submit" loading={submitting}>{submitLabel}</Button>
  </div>
</form>
