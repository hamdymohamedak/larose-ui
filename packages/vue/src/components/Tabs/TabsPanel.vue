<script setup lang="ts">
import { computed, type CSSProperties } from 'vue';
import { createTabIds, isTabSelected } from '@larose-ui/primitives';
import styles from '@larose-ui/styles/components/Tabs/Tabs.module.css';
import { cn } from '../../utils/cn';
import { useTabsContext } from './context';

const props = defineProps<{ value: string; class?: string; style?: CSSProperties }>();
const ctx = useTabsContext('TabsPanel');
const selected = computed(() => isTabSelected(ctx.value.value, props.value));
const ids = computed(() => createTabIds(ctx.baseId, props.value));
</script>

<template>
  <div
    v-if="selected"
    role="tabpanel"
    :id="ids.panelId"
    :aria-labelledby="ids.tabId"
    tabindex="0"
    :class="cn(styles.panel, props.class)"
    :style="props.style"
  >
    <slot />
  </div>
</template>
