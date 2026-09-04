<script lang="ts">
  import { Form } from '@larose-ui/forms-svelte';
  import type { FormSchema, FormValues } from '@larose-ui/forms-core';
  import { Input, Button } from '@larose-ui/svelte';
  import type { AIAdapter } from '@larose-ui/ai-core';
  import { createMockAdapter } from '@larose-ui/ai-core';
  import { getSmartAIRuntime } from './getSmartAIRuntime';
  import styles from './SmartForm.module.css';

  interface Props {
    schema: FormSchema;
    initialValues?: FormValues;
    submitUrl?: string;
    submitLabel?: string;
    adapter?: AIAdapter;
    promptPlaceholder?: string;
    writePermission?: string;
    onsubmit?: (values: FormValues) => void;
  }

  let {
    schema,
    initialValues = {},
    submitUrl,
    submitLabel = 'Save',
    adapter = createMockAdapter(),
    promptPlaceholder = 'Describe what to create… e.g. "Create employee for Ahmed Mohamed"',
    writePermission = 'employees.write',
    onsubmit,
  }: Props = $props();

  const runtime = getSmartAIRuntime(adapter);
  let prompt = $state('');
  let values = $state<FormValues>({ ...initialValues });
  let explanation = $state<string | null>(null);
  let denial = $state<string | null>(null);
  let formKey = $state(0);

  async function populate() {
    denial = null;
    const fields = schema.fields.map((f) => ({ name: f.name, label: f.label }));
    const execution = await runtime.populateForm(prompt, fields, writePermission);

    if (!execution.allowed || !execution.result) {
      denial = execution.denialReason ?? 'Action not permitted';
      explanation = null;
      return;
    }

    values = { ...values, ...execution.result.values };
    explanation = execution.result.explanation;
    formKey += 1;
  }
</script>

<div class={styles.wrapper} data-lr-smart-form data-lr-component="SmartForm">
  <div class={styles.promptRow}>
    <Input
      label="Smart populate"
      placeholder={promptPlaceholder}
      bind:value={prompt}
      onkeydown={(e: KeyboardEvent) => {
        if (e.key === 'Enter') void populate();
      }}
    />
    <Button variant="outline" onclick={() => void populate()}>Populate</Button>
  </div>
  {#if denial}
    <p class={styles.denial} data-lr-ai-denied role="alert">{denial}</p>
  {/if}
  {#if explanation && !denial}
    <p class={styles.explanation}>{explanation}</p>
  {/if}
  {#key formKey}
    <Form
      {schema}
      initialValues={values}
      {submitUrl}
      {submitLabel}
      {onsubmit}
    />
  {/key}
</div>
