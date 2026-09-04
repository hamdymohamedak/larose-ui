<script lang="ts">
  import { Form } from '@larose-ui/forms-svelte';
  import { Can } from '@larose-ui/permissions-svelte';
  import { Alert } from '@larose-ui/svelte';
  import {
    compileFormSchema,
    validateUISchema,
    type UISchema,
  } from '@larose-ui/enterprise-core';

  interface Props {
    schema: UISchema;
    onsubmit?: (values: Record<string, string>) => void;
  }

  let { schema, onsubmit }: Props = $props();

  const errors = $derived(validateUISchema(schema));
  const formSchema = $derived(schema.type === 'form' ? compileFormSchema(schema) : null);
</script>

{#if errors.length > 0}
  <Alert variant="error" title="Invalid UI schema">
    <ul style="margin: 0; padding-inline-start: 1.25rem">
      {#each errors as e (e)}
        <li>{e}</li>
      {/each}
    </ul>
  </Alert>
{:else if schema.type !== 'form'}
  <Alert variant="info" title="Schema type not rendered">
    Page and table schemas are composed at the app layer. Use compileFormSchema for forms.
  </Alert>
{:else if schema.permission && formSchema}
  <Can permission={schema.permission} fallback="forbidden">
    <Form schema={formSchema} submitUrl={schema.submitUrl} submitLabel="Save" {onsubmit} />
  </Can>
{:else if formSchema}
  <Form schema={formSchema} submitUrl={schema.submitUrl} submitLabel="Save" {onsubmit} />
{/if}
