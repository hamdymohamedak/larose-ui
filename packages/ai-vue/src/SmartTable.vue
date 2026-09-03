<script setup lang="ts" generic="T">
import { ref, watch } from 'vue';
import { AdaptiveTable, type Column } from '@larose-ui/runtime-vue';
import { Input, Button } from '@larose-ui/vue';
import type { AIAdapter } from '@larose-ui/ai-core';
import { createMockAdapter } from '@larose-ui/ai-core';
import { useSmartAIRuntimeComputed } from './useSmartAIRuntime';
import styles from './SmartTable.module.css';

const props = withDefaults(
  defineProps<{
    data: T[];
    columns: Column<T>[];
    keyExtractor: (row: T) => string;
    loading?: boolean;
    emptyMessage?: string;
    adapter?: AIAdapter;
    filterPlaceholder?: string;
    readPermission?: string;
  }>(),
  {
    adapter: () => createMockAdapter(),
    filterPlaceholder: 'Ask in natural language… e.g. "Show employees late more than 3 times"',
    readPermission: 'employees.read',
    loading: false,
  },
);

const runtime = useSmartAIRuntimeComputed(props.adapter);
const query = ref('');
const explanation = ref<string | null>(null);
const denial = ref<string | null>(null);
const filtered = ref<T[]>([...props.data]);

watch(
  () => props.data,
  (next) => {
    filtered.value = next;
  },
);

async function applyQuery() {
  denial.value = null;
  const execution = await runtime.value.filterTable(
    query.value,
    props.data as Array<Record<string, unknown>>,
    props.columns.map((c) => ({ key: c.key, header: c.header })),
    props.readPermission,
  );

  if (!execution.allowed || !execution.result) {
    denial.value = execution.denialReason ?? 'Action not permitted';
    explanation.value = null;
    return;
  }

  filtered.value = execution.result.data as T[];
  explanation.value = execution.result.explanation;
}
</script>

<template>
  <div :class="styles.wrapper" data-lr-smart-table data-lr-component="SmartTable">
    <div :class="styles.promptRow">
      <Input
        label="Smart filter"
        :placeholder="filterPlaceholder"
        :model-value="query"
        @update:model-value="query = $event"
        @keydown.enter="applyQuery"
      />
      <Button @click="applyQuery">Apply</Button>
    </div>
    <p v-if="denial" :class="styles.denial" data-lr-ai-denied role="alert">{{ denial }}</p>
    <p v-if="explanation && !denial" :class="styles.explanation">{{ explanation }}</p>
    <AdaptiveTable
      :data="filtered"
      :columns="columns"
      :key-extractor="keyExtractor"
      :loading="loading"
      :empty-message="emptyMessage"
    />
  </div>
</template>
