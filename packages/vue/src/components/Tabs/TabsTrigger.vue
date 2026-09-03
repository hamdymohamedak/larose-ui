<script setup lang="ts">
import { computed, type CSSProperties } from 'vue';
import { createTabIds, isTabSelected } from '@larose-ui/primitives';
import styles from '@larose-ui/styles/components/Tabs/Tabs.module.css';
import { cn } from '../../utils/cn';
import { useTabsContext } from './context';

const props = defineProps<{
  value: string;
  disabled?: boolean;
  class?: string;
  style?: CSSProperties;
}>();

const ctx = useTabsContext('TabsTrigger');
const selected = computed(() => isTabSelected(ctx.value.value, props.value));
const ids = computed(() => createTabIds(ctx.baseId, props.value));
</script>

<template>
  <button
    type="button"
    role="tab"
    :id="ids.tabId"
    :aria-selected="selected"
    :aria-controls="ids.panelId"
    :tabindex="selected ? 0 : -1"
    :disabled="disabled"
    :data-state="selected ? 'active' : 'inactive'"
    :data-value="value"
    :class="cn(styles.trigger, props.class)"
    :style="props.style"
    @click="ctx.onValueChange(value)"
  >
    <slot />
  </button>
</template>
