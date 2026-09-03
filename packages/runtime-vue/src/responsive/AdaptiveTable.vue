<script setup lang="ts" generic="T">
import { computed } from 'vue';
import { shouldUseSkeleton } from '@larose-ui/network';
import type { NetworkCondition } from '@larose-ui/core';
import { useBreakpoint } from './context';
import { useI18n } from '../i18n/context';
import type { Column } from './types';

const props = withDefaults(
  defineProps<{
    data: T[];
    columns: Column<T>[];
    keyExtractor: (row: T) => string;
    loading?: boolean;
    emptyMessage?: string;
    networkCondition?: NetworkCondition;
  }>(),
  { loading: false },
);

const breakpoint = useBreakpoint();
const { t } = useI18n();

const showSkeleton = computed(
  () =>
    props.loading ||
    (props.networkCondition ? shouldUseSkeleton(props.networkCondition) : false),
);

const isMobile = computed(() => breakpoint.isMobile || breakpoint.breakpoint === 'mobile');
const visibleColumns = computed(() =>
  isMobile.value ? props.columns.filter((c) => c.priority !== 'low') : props.columns,
);
</script>

<template>
  <div v-if="showSkeleton" data-lr-adaptive-table="skeleton" aria-busy="true">
    <div
      v-for="i in 3"
      :key="i"
      style="height: 48px; background: var(--lr-color-surface); border-radius: var(--lr-radius-md); margin-bottom: var(--lr-space-2)"
    />
  </div>
  <div v-else-if="data.length === 0" data-lr-adaptive-table="empty" role="status">
    {{ emptyMessage ?? t('common.empty') }}
  </div>
  <div v-else-if="isMobile" data-lr-adaptive-table="cards">
    <article
      v-for="row in data"
      :key="keyExtractor(row)"
      style="padding: var(--lr-space-4); border: 1px solid var(--lr-color-border); border-radius: var(--lr-radius-md); margin-bottom: var(--lr-space-3); background: var(--lr-color-surface-elevated)"
    >
      <div
        v-for="col in visibleColumns"
        :key="col.key"
        style="display: flex; justify-content: space-between; margin-bottom: var(--lr-space-2)"
      >
        <span style="color: var(--lr-color-text-muted); font-size: var(--lr-font-size-sm)">{{ col.header }}</span>
        <span>{{ col.render(row) }}</span>
      </div>
    </article>
  </div>
  <table v-else data-lr-adaptive-table="table" style="width: 100%; border-collapse: collapse">
    <thead>
      <tr>
        <th
          v-for="col in columns"
          :key="col.key"
          style="text-align: start; padding: var(--lr-space-3); border-bottom: 2px solid var(--lr-color-border); font-weight: var(--lr-font-weight-semibold)"
        >
          {{ col.header }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in data" :key="keyExtractor(row)">
        <td
          v-for="col in columns"
          :key="col.key"
          style="padding: var(--lr-space-3); border-bottom: 1px solid var(--lr-color-border)"
        >
          {{ col.render(row) }}
        </td>
      </tr>
    </tbody>
  </table>
</template>
