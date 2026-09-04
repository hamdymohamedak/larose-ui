<script setup lang="ts">
import { computed } from 'vue';
import { formatTabLabel } from '../../TabView/utils';
import styles from '@larose-ui/styles/components/TabView/TabView.module.css';
import { useTabViewContext } from '../../composables/useTabView';

const props = defineProps<{
  value: string;
  label: string;
  disabled?: boolean;
  class?: string;
  style?: Record<string, string | number>;
}>();

const ctx = useTabViewContext('TabViewTab');
const selected = computed(() => ctx.value.value === props.value);
const tabId = computed(() => `${ctx.baseId}-tab-${props.value}`);
const panelId = computed(() => `${ctx.baseId}-panel-${props.value}`);
</script>

<template>
  <li role="presentation" :class="props.class" :style="props.style">
    <button
      type="button"
      :id="tabId"
      role="tab"
      :class="styles.tab"
      :aria-selected="selected"
      :aria-controls="panelId"
      :tabindex="selected ? 0 : -1"
      :data-selected="selected ? 'true' : undefined"
      :disabled="disabled"
      @click="ctx.onValueChange(value)"
    >
      {{ formatTabLabel(label) }}
    </button>
  </li>
</template>
