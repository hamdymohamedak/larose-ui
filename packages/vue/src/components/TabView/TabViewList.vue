<script setup lang="ts">
import { onMounted, useSlots } from 'vue';
import { warnIfTooManyTabs } from '../../TabView/utils';
import styles from '@larose-ui/styles/components/TabView/TabView.module.css';
import { cn } from '../../utils/cn';

defineProps<{
  class?: string;
  style?: Record<string, string | number>;
  'aria-label'?: string;
}>();

const slots = useSlots();
onMounted(() => {
  const nodes = slots.default?.({}) ?? [];
  warnIfTooManyTabs(nodes.length);
});
</script>

<template>
  <ul
    :class="cn(styles.tabList, $props.class)"
    :style="$props.style"
    role="tablist"
    :aria-label="$props['aria-label'] ?? 'Tabs'"
  >
    <slot />
  </ul>
</template>
