<script lang="ts" generics="T">
  import { AdaptiveTable, type Column } from '@larose-ui/runtime-svelte';
  import { Input, Button } from '@larose-ui/svelte';
  import type { AIAdapter } from '@larose-ui/ai-core';
  import { createMockAdapter } from '@larose-ui/ai-core';
  import { getSmartAIRuntime } from './getSmartAIRuntime';
  import styles from './SmartTable.module.css';

  interface Props {
    data: T[];
    columns: Column<T>[];
    keyExtractor: (row: T) => string;
    loading?: boolean;
    emptyMessage?: string;
    adapter?: AIAdapter;
    filterPlaceholder?: string;
    readPermission?: string;
  }

  let {
    data,
    columns,
    keyExtractor,
    loading = false,
    emptyMessage,
    adapter = createMockAdapter(),
    filterPlaceholder = 'Ask in natural language… e.g. "Show employees late more than 3 times"',
    readPermission = 'employees.read',
  }: Props = $props();

  const runtime = getSmartAIRuntime(adapter);
  let query = $state('');
  let explanation = $state<string | null>(null);
  let denial = $state<string | null>(null);
  let filtered = $state(data);

  $effect(() => {
    filtered = data;
  });

  async function applyQuery() {
    denial = null;
    const execution = await runtime.filterTable(
      query,
      data as Array<Record<string, unknown>>,
      columns.map((c) => ({ key: c.key, header: c.header })),
      readPermission,
    );

    if (!execution.allowed || !execution.result) {
      denial = execution.denialReason ?? 'Action not permitted';
      explanation = null;
      return;
    }

    filtered = execution.result.data as T[];
    explanation = execution.result.explanation;
  }
</script>

<div class={styles.wrapper} data-lr-smart-table data-lr-component="SmartTable">
  <div class={styles.promptRow}>
    <Input
      label="Smart filter"
      placeholder={filterPlaceholder}
      bind:value={query}
      onkeydown={(e) => {
        if (e.key === 'Enter') void applyQuery();
      }}
    />
    <Button onclick={() => void applyQuery()}>Apply</Button>
  </div>
  {#if denial}
    <p class={styles.denial} data-lr-ai-denied role="alert">{denial}</p>
  {/if}
  {#if explanation && !denial}
    <p class={styles.explanation}>{explanation}</p>
  {/if}
  <AdaptiveTable data={filtered} {columns} {keyExtractor} {loading} {emptyMessage} />
</div>
