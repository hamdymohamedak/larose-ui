<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { OutlineColumn, OutlineNode, SortDirection } from '../../ListTable/types';
import {
  collectExpandableSubtree, filterOutline, flattenOutline, formatColumnHeader, nextSortDirection,
  normalizeOutlineColumns, sortOutlineNodes, truncateMiddle,
} from '../../ListTable/utils';
import styles from '@larose-ui/styles/components/ListTable/ListTable.module.css';
import { cn } from '../../utils/cn';

const PRIMARY = 'label';
const STORAGE = 'larose-outline-expanded';

const props = withDefaults(defineProps<{
  data: OutlineNode[]; primaryColumnHeader?: string; columns?: Array<string | OutlineColumn>;
  defaultExpandedIds?: string[]; expandedIds?: string[]; storageKey?: string; selectedId?: string;
  sortable?: boolean; defaultSortKey?: string; defaultSortDirection?: SortDirection;
  resizableColumns?: boolean; alternatingRows?: boolean; truncate?: 'middle' | 'end';
  searchQuery?: string; class?: string; style?: Record<string, string | number>; 'aria-label'?: string;
}>(), {
  primaryColumnHeader: 'Name', defaultExpandedIds: () => [], sortable: true, defaultSortKey: 'label',
  defaultSortDirection: 'asc', resizableColumns: true, alternatingRows: true, truncate: 'end',
  searchQuery: '', 'aria-label': 'Outline view',
});

const emit = defineEmits<{
  expandedChange: [string[]];
  select: [OutlineNode];
  rowDoubleClick: [OutlineNode];
  cellEdit: [string, string, string];
}>();

const normalized = computed(() => normalizeOutlineColumns(props.columns));
const internalExpanded = ref(new Set(props.defaultExpandedIds));
const expanded = computed(() => (props.expandedIds ? new Set(props.expandedIds) : internalExpanded.value));
const sortKey = ref(props.defaultSortKey);
const sortDirection = ref<SortDirection>(props.defaultSortDirection);
const widths = ref<Record<string, number>>({
  [PRIMARY]: 240,
  ...Object.fromEntries(normalized.value.map((c) => [c.key, c.width ?? 128])),
});

watch(internalExpanded, (set) => {
  if (props.storageKey && !props.expandedIds && typeof window !== 'undefined') {
    window.localStorage.setItem(`${STORAGE}:${props.storageKey}`, JSON.stringify([...set]));
  }
}, { deep: true });

const filtered = computed(() => filterOutline(props.data, props.searchQuery));
const sorted = computed(() => sortOutlineNodes(filtered.value, sortKey.value, sortDirection.value));
const rows = computed(() => flattenOutline(sorted.value, expanded.value));

function toggle(node: OutlineNode, altKey: boolean) {
  const next = new Set(expanded.value);
  if (altKey) {
    for (const id of collectExpandableSubtree(node)) {
      if (next.has(node.id)) next.delete(id); else next.add(id);
    }
  } else if (next.has(node.id)) next.delete(node.id);
  else next.add(node.id);
  if (!props.expandedIds) internalExpanded.value = next;
  emit('expandedChange', [...next]);
}

function onSort(key: string) {
  sortDirection.value = nextSortDirection(sortKey.value, key, sortDirection.value);
  sortKey.value = key;
}

function startResize(key: string, startX: number) {
  const start = widths.value[key] ?? 128;
  const onMove = (e: MouseEvent) => { widths.value = { ...widths.value, [key]: Math.max(96, start + e.clientX - startX) }; };
  const onUp = () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onUp);
}

function text(v: string) {
  return props.truncate === 'middle' ? truncateMiddle(v) : v;
}
</script>

<template>
  <div :class="cn(styles.outlineWrap, props.class)" :style="props.style">
    <table :class="styles.table" :aria-label="props['aria-label']">
      <colgroup>
        <col :style="{ width: widths[PRIMARY] + 'px' }" />
        <col v-for="column in normalized" :key="column.key" :style="{ width: (widths[column.key] ?? 128) + 'px' }" />
      </colgroup>
      <thead>
        <tr>
          <th scope="col" :class="styles.tableHeadCell">
            <button v-if="sortable" type="button" :class="styles.sortButton" :data-active="sortKey === PRIMARY ? 'true' : undefined" @click="onSort(PRIMARY)">
              {{ formatColumnHeader(primaryColumnHeader) }}{{ sortKey === PRIMARY ? (sortDirection === 'asc' ? ' ↑' : ' ↓') : '' }}
            </button>
            <template v-else>{{ formatColumnHeader(primaryColumnHeader) }}</template>
            <span v-if="resizableColumns" :class="styles.resizeHandle" role="separator" @mousedown="startResize(PRIMARY, $event.clientX)" />
          </th>
          <th v-for="column in normalized" :key="column.key" scope="col" :class="styles.tableHeadCell">
            <button v-if="sortable && column.sortable !== false" type="button" :class="styles.sortButton" :data-active="sortKey === column.key ? 'true' : undefined" @click="onSort(column.key)">
              {{ formatColumnHeader(column.header) }}{{ sortKey === column.key ? (sortDirection === 'asc' ? ' ↑' : ' ↓') : '' }}
            </button>
            <template v-else>{{ formatColumnHeader(column.header) }}</template>
            <span v-if="resizableColumns" :class="styles.resizeHandle" role="separator" @mousedown="startResize(column.key, $event.clientX)" />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="({ node, depth }, index) in rows"
          :key="node.id"
          :class="styles.tableRow"
          :data-selected="selectedId === node.id ? 'true' : undefined"
          :data-alt="alternatingRows && index % 2 === 1 ? 'true' : undefined"
          style="cursor: pointer"
          @click="emit('select', node)"
          @dblclick="emit('rowDoubleClick', node)"
        >
          <td :class="styles.tableCell">
            <div :class="styles.outlineLabelCell">
              <span :class="styles.outlineIndent" :style="{ width: `${depth}rem` }" />
              <button
                v-if="node.children?.length"
                type="button"
                :class="styles.outlineToggle"
                :data-expanded="expanded.has(node.id) ? 'true' : 'false'"
                :aria-expanded="expanded.has(node.id)"
                @click.stop="toggle(node, ($event as MouseEvent).altKey)"
              >
                <svg viewBox="0 0 10 10" fill="currentColor" aria-hidden="true"><path d="M3 1.5 8 5 3 8.5V1.5Z" /></svg>
              </button>
              <span v-else :class="styles.outlineSpacer" aria-hidden="true" />
              <span>{{ text(node.label) }}</span>
            </div>
          </td>
          <td v-for="column in normalized" :key="column.key" :class="styles.tableCell">{{ text(node.values?.[column.key] ?? '—') }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
