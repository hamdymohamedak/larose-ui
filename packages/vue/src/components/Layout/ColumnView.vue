<script setup lang="ts">
import { computed, ref, type CSSProperties } from 'vue';
import styles from '@larose-ui/styles/components/Layout/Layout.module.css';
import { cn } from '../../utils/cn';
import { getNodesAtPath, findNodeByPath } from '../../Layout/utils';
import type { ColumnViewNode } from '../../Layout/types';

const props = defineProps<{
  root: ColumnViewNode[];
  modelValue?: string[];
  class?: string;
  style?: CSSProperties;
  ariaLabel?: string;
}>();

const emit = defineEmits<{ 'update:modelValue': [path: string[]] }>();
const internal = ref<string[]>([]);
const path = computed(() => props.modelValue ?? internal.value);
const columns = computed(() => {
  const cols: ColumnViewNode[][] = [props.root];
  let current = props.root;
  for (const id of path.value) {
    const node = current.find((n) => n.id === id);
    if (!node?.children) break;
    current = node.children;
    cols.push(current);
  }
  return cols;
});
const selected = computed(() => findNodeByPath(props.root, path.value));

function selectAt(columnIndex: number, id: string) {
  const next = [...path.value.slice(0, columnIndex), id];
  if (props.modelValue === undefined) internal.value = next;
  emit('update:modelValue', next);
}
</script>

<template>
  <div :class="cn(styles.columnView, props.class)" :style="props.style" :aria-label="ariaLabel ?? 'Column view'">
    <div
      v-for="(nodes, columnIndex) in columns"
      :key="columnIndex"
      :class="styles.column"
      role="listbox"
      :aria-label="`Column ${columnIndex + 1}`"
    >
      <button
        v-for="node in nodes"
        :key="node.id"
        type="button"
        :class="styles.row"
        role="option"
        :aria-selected="path[columnIndex] === node.id"
        @click="selectAt(columnIndex, node.id)"
      >
        <span>{{ node.label }}</span>
        <span v-if="node.children?.length" :class="styles.disclosure" aria-hidden="true">›</span>
      </button>
    </div>
    <div v-if="selected" :class="styles.detailPane">
      <slot name="detail" :node="selected" />
      <dl v-if="selected.meta" :class="styles.detailMeta">
        <div v-for="(value, key) in selected.meta" :key="key" :class="styles.detailMetaRow">
          <dt>{{ key }}</dt>
          <dd>{{ value }}</dd>
        </div>
      </dl>
    </div>
  </div>
</template>
