<script setup lang="ts" generic="T">
import { computed, ref } from 'vue';
import type { SortDirection, TableSelectionMode } from '../../ListTable/types';
import { formatColumnHeader, nextSortDirection, sortRows } from '../../ListTable/utils';
import styles from '@larose-ui/styles/components/ListTable/ListTable.module.css';
import { cn } from '../../utils/cn';

export interface TableColumn<T> {
  key: string; header: string; render: (row: T) => unknown; sortValue?: (row: T) => string; sortable?: boolean; width?: number;
}

const props = withDefaults(defineProps<{
  data: T[]; columns: TableColumn<T>[]; keyExtractor: (row: T) => string; caption?: string; 'aria-label'?: string;
  selectionMode?: TableSelectionMode; selectedKey?: string; defaultSortKey?: string; defaultSortDirection?: SortDirection;
  alternatingRows?: boolean; resizableColumns?: boolean; class?: string; style?: Record<string, string | number>;
}>(), { selectionMode: 'none', defaultSortDirection: 'asc', alternatingRows: true, resizableColumns: true });

const emit = defineEmits<{ selectRow: [T] }>();
const sortKey = ref(props.defaultSortKey ?? props.columns[0]?.key ?? '');
const sortDirection = ref<SortDirection>(props.defaultSortDirection);
const widths = ref<Record<string, number>>(Object.fromEntries(props.columns.map((c) => [c.key, c.width ?? 160])));

const sortedData = computed(() => {
  const column = props.columns.find((c) => c.key === sortKey.value);
  if (!column?.sortable || !column.sortValue) return props.data;
  return sortRows(props.data, column.sortValue, sortDirection.value);
});

function onSort(columnKey: string) {
  sortDirection.value = nextSortDirection(sortKey.value, columnKey, sortDirection.value);
  sortKey.value = columnKey;
}

function startResize(columnKey: string, startX: number) {
  const startWidth = widths.value[columnKey] ?? 160;
  const onMove = (event: MouseEvent) => {
    widths.value = { ...widths.value, [columnKey]: Math.max(96, startWidth + event.clientX - startX) };
  };
  const onUp = () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onUp);
}
</script>

<template>
  <div :class="cn(styles.tableWrap, props.class)" :style="props.style">
    <table :class="styles.table" :aria-label="props['aria-label'] ?? caption">
      <caption v-if="caption" :class="styles.tableCaption">{{ caption }}</caption>
      <colgroup>
        <col v-for="column in columns" :key="column.key" :style="{ width: widths[column.key] + 'px' }" />
      </colgroup>
      <thead>
        <tr>
          <th v-for="column in columns" :key="column.key" scope="col" :class="styles.tableHeadCell">
            <button v-if="column.sortable" type="button" :class="styles.sortButton" :data-active="sortKey === column.key ? 'true' : undefined" @click="onSort(column.key)">
              {{ formatColumnHeader(column.header) }}{{ sortKey === column.key ? (sortDirection === 'asc' ? ' ↑' : ' ↓') : '' }}
            </button>
            <template v-else>{{ formatColumnHeader(column.header) }}</template>
            <span v-if="resizableColumns" :class="styles.resizeHandle" role="separator" aria-orientation="vertical" :aria-label="`Resize ${column.header} column`" @mousedown="startResize(column.key, $event.clientX)" />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, index) in sortedData"
          :key="keyExtractor(row)"
          :class="styles.tableRow"
          :data-selected="selectedKey === keyExtractor(row) ? 'true' : undefined"
          :data-alt="alternatingRows && index % 2 === 1 ? 'true' : undefined"
          :style="selectionMode !== 'none' ? { cursor: 'pointer' } : undefined"
          @click="selectionMode !== 'none' && emit('selectRow', row)"
        >
          <td v-for="column in columns" :key="column.key" :class="styles.tableCell">{{ column.render(row) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
