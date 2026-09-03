<script setup lang="ts">
import { ref } from 'vue';
import type { DropResult } from '../../DragDrop/types';
import styles from '@larose-ui/styles/components/DragDrop/DragDrop.module.css';
import { cn } from '../../utils/cn';
import DragDropProvider from './DragDropProvider.vue';
import Draggable from './Draggable.vue';
import DropZone from './DropZone.vue';

export interface DragDropListItem {
  id: string;
  label: string;
  type?: string;
}

const props = withDefaults(
  defineProps<{
    zoneId?: string;
    items: DragDropListItem[];
    class?: string;
    style?: Record<string, string | number>;
  }>(),
  { zoneId: 'list' },
);

const emit = defineEmits<{ reorder: [DragDropListItem[]] }>();
const transferring = ref(false);

async function handleDrop(result: DropResult<unknown>) {
  if (result.destinationId !== props.zoneId || result.operation !== 'move') return;
  const dragged = result.items[0]?.data as DragDropListItem | undefined;
  if (!dragged) return;
  transferring.value = true;
  await new Promise((resolve) => window.setTimeout(resolve, 400));
  const fromIndex = props.items.findIndex((item) => item.id === dragged.id);
  if (fromIndex < 0) {
    transferring.value = false;
    return;
  }
  const next = [...props.items];
  const [removed] = next.splice(fromIndex, 1);
  next.push(removed!);
  emit('reorder', next);
  transferring.value = false;
}
</script>

<template>
  <DragDropProvider>
    <DropZone
      :id="zoneId"
      accepts="list-item"
      :transferring="transferring"
      transferring-label="Moving item…"
      :class="cn(props.class)"
      :style="props.style"
      @drop="handleDrop"
    >
      <ul :class="styles.list" role="list">
        <li v-for="item in items" :key="item.id">
          <Draggable
            :id="item.id"
            :source-id="zoneId"
            :data="item"
            type="list-item"
            :label="item.label"
          >
            <div :class="styles.listItem">
              <span :class="styles.listItemHandle" aria-hidden="true">⠿</span>
              <span :class="styles.listItemLabel">
                <slot :item="item">{{ item.label }}</slot>
              </span>
            </div>
          </Draggable>
        </li>
      </ul>
    </DropZone>
  </DragDropProvider>
</template>
