<script lang="ts">
  import { Input } from '@larose-ui/svelte';
  import { getOptionalObservabilityContext } from '@larose-ui/observability-svelte';
  import { getOptionalAuditContext } from './context';
  import AuditHistory from './AuditHistory.svelte';
  import styles from './AuditedInput.module.css';

  interface Props {
    field: string;
    resourceId?: string;
    showHistory?: boolean;
    value?: string;
    label?: string;
    placeholder?: string;
    type?: string;
    onchange?: (value: string) => void;
  }

  let {
    field,
    resourceId,
    showHistory = true,
    value = $bindable(''),
    label,
    placeholder,
    type = 'text',
    onchange,
  }: Props = $props();

  const audit = getOptionalAuditContext();
  const observability = getOptionalObservabilityContext();
  let historyOpen = $state(false);
  let previous = $state(value);

  $effect(() => {
    const next = value;
    if (previous === next) return;
    if (audit) {
      audit.recordChange({ field, before: previous, after: next, resourceId });
    }
    observability?.track({
      type: 'interaction',
      component: 'AuditedInput',
      metadata: { field, resourceId, action: 'change' },
    });
    onchange?.(next);
    previous = next;
  });
</script>

<div class={styles.wrapper} data-lr-audited-field={field}>
  <Input {label} {type} {placeholder} bind:value />
  {#if showHistory && audit}
    <button
      type="button"
      class={styles.historyButton}
      onclick={() => (historyOpen = !historyOpen)}
    >
      View History
    </button>
    {#if historyOpen}
      <AuditHistory {field} {resourceId} onclose={() => (historyOpen = false)} />
    {/if}
  {/if}
</div>
