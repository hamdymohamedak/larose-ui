<script setup lang="ts">
import { computed, type CSSProperties } from 'vue';
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
const selected = computed(() => ctx.value.value === props.value);
const tabId = computed(() => `${ctx.baseId}-tab-${props.value}`);
const panelId = computed(() => `${ctx.baseId}-panel-${props.value}`);
</script>

<template>
  <button
    type="button"
    role="tab"
    :id="tabId"
    :aria-selected="selected"
    :aria-controls="panelId"
    :tabindex="selected ? 0 : -1"
    :disabled="disabled"
    :data-state="selected ? 'active' : 'inactive'"
    :class="cn(styles.trigger, props.class)"
    :style="props.style"
    @click="ctx.onValueChange(value)"
  >
    <slot />
  </button>
</template>
