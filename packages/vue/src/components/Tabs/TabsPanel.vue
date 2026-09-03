<script setup lang="ts">
import { computed, type CSSProperties } from 'vue';
import styles from '@larose-ui/styles/components/Tabs/Tabs.module.css';
import { cn } from '../../utils/cn';
import { useTabsContext } from './context';

const props = defineProps<{ value: string; class?: string; style?: CSSProperties }>();
const ctx = useTabsContext('TabsPanel');
const selected = computed(() => ctx.value.value === props.value);
const tabId = computed(() => `${ctx.baseId}-tab-${props.value}`);
const panelId = computed(() => `${ctx.baseId}-panel-${props.value}`);
</script>

<template>
  <div
    v-if="selected"
    role="tabpanel"
    :id="panelId"
    :aria-labelledby="tabId"
    tabindex="0"
    :class="cn(styles.panel, props.class)"
    :style="props.style"
  >
    <slot />
  </div>
</template>
