<script setup lang="ts">
import type { CSSProperties } from 'vue';
import styles from '@larose-ui/styles/components/Disclosure/Disclosure.module.css';
import { cn } from '../../utils/cn';
import DisclosureTriangle from './DisclosureTriangle.vue';

export interface DisclosureListItem {
  id: string;
  label: string;
  defaultExpanded?: boolean;
  children?: DisclosureListItem[];
}

const props = defineProps<{
  items: DisclosureListItem[];
  class?: string;
  style?: CSSProperties;
}>();
</script>

<template>
  <ul :class="cn(styles.nestedList, props.class)" :style="props.style">
    <li v-for="item in items" :key="item.id" :class="styles.nestedItem">
      <DisclosureTriangle
        v-if="item.children?.length"
        :label="item.label"
        :default-expanded="item.defaultExpanded"
      >
        <DisclosureList :items="item.children" />
      </DisclosureTriangle>
      <span v-else>{{ item.label }}</span>
    </li>
  </ul>
</template>
