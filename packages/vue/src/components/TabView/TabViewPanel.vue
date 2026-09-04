<script setup lang="ts">
import { computed } from 'vue';
import styles from '@larose-ui/styles/components/TabView/TabView.module.css';
import { cn } from '../../utils/cn';
import { useTabViewContext } from '../../composables/useTabView';

const props = defineProps<{
  value: string;
  class?: string;
  style?: Record<string, string | number>;
}>();

const ctx = useTabViewContext('TabViewPanel');
const selected = computed(() => ctx.value.value === props.value);
const tabId = computed(() => `${ctx.baseId}-tab-${props.value}`);
const panelId = computed(() => `${ctx.baseId}-panel-${props.value}`);
</script>

<template>
  <div
    v-if="selected"
    :id="panelId"
    role="tabpanel"
    :class="cn(styles.panel, props.class)"
    :style="props.style"
    :aria-labelledby="tabId"
    tabindex="0"
  >
    <slot />
  </div>
</template>
