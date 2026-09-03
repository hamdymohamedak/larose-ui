<script setup lang="ts">
import type { ListAccessory } from '../../ListTable/types';
import { truncateMiddle } from '../../ListTable/utils';
import styles from '@larose-ui/styles/components/ListTable/ListTable.module.css';
import { cn } from '../../utils/cn';
const props = withDefaults(defineProps<{
  title: string; subtitle?: string; accessory?: ListAccessory; selected?: boolean; disabled?: boolean;
  truncate?: 'end' | 'middle'; class?: string; style?: Record<string, string | number>;
}>(), { accessory: 'none', selected: false, disabled: false, truncate: 'end' });
const emit = defineEmits<{ press: []; info: [MouseEvent] }>();
const displayTitle = () => props.truncate === 'middle' ? truncateMiddle(props.title) : props.title;
</script>
<template>
  <li>
    <button type="button" :class="cn(styles.row, props.class)" :style="props.style" :data-selected="selected ? 'true' : undefined" :disabled="disabled" @click="emit('press')">
      <span v-if="$slots.leading" :class="styles.rowLeading"><slot name="leading" /></span>
      <span :class="styles.rowText">
        <span :class="styles.rowTitle" :data-truncate="truncate">{{ displayTitle() }}</span>
        <span v-if="subtitle" :class="styles.rowSubtitle">{{ subtitle }}</span>
      </span>
      <button v-if="accessory === 'info'" type="button" :class="styles.infoButton" :aria-label="`More information about ${title}`" @click.stop="emit('info', $event)">i</button>
      <span v-else-if="accessory !== 'none'" :class="styles.rowAccessory" aria-hidden="true">{{ accessory === 'disclosure' ? '›' : accessory === 'checkmark' ? '✓' : '' }}</span>
    </button>
  </li>
</template>
