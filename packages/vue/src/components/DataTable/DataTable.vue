<script setup lang="ts" generic="T extends Record<string, unknown>">
import type { CSSProperties } from 'vue';
import styles from '@larose-ui/styles/components/DataTable/DataTable.module.css';
import { cn } from '../../utils/cn';
import EmptyState from '../EmptyState/EmptyState.vue';
import Skeleton from '../Skeleton/Skeleton.vue';

export interface DataTableColumn<T> {
  key: string;
  header: string;
  accessor?: (row: T) => unknown;
  render?: (row: T) => unknown;
}

const props = withDefaults(
  defineProps<{
    data: T[];
    columns: DataTableColumn<T>[];
    keyExtractor: (row: T) => string;
    caption?: string;
    ariaLabel?: string;
    loading?: boolean;
    emptyTitle?: string;
    emptyDescription?: string;
    striped?: boolean;
    skeletonRows?: number;
    class?: string;
    style?: CSSProperties;
  }>(),
  { loading: false, emptyTitle: 'No data', striped: false, skeletonRows: 3 },
);

function cell(row: T, column: DataTableColumn<T>) {
  if (column.render) return column.render(row);
  if (column.accessor) return column.accessor(row);
  return (row as Record<string, unknown>)[column.key];
}
</script>

<template>
  <div :class="cn(styles.wrapper, props.class)" :style="props.style">
    <template v-if="loading">
      <div v-for="i in skeletonRows" :key="i" :class="styles.skeletonRow"><Skeleton /></div>
    </template>
    <EmptyState
      v-else-if="!data.length"
      :title="emptyTitle"
      :description="emptyDescription"
      :class="styles.empty"
    />
    <table v-else :class="styles.table" :aria-label="ariaLabel" :data-striped="striped ? 'true' : undefined">
      <caption v-if="caption" :class="styles.caption">{{ caption }}</caption>
      <thead>
        <tr>
          <th v-for="column in columns" :key="column.key" :class="styles.headCell" scope="col">
            {{ column.header }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in data" :key="keyExtractor(row)" :class="styles.row">
          <td v-for="column in columns" :key="column.key" :class="styles.cell">
            {{ cell(row, column) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
