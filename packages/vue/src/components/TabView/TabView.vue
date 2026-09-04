<script setup lang="ts">
import { computed, provide, ref, useId, watch } from 'vue';
import type { TabViewVariant } from '../../TabView/types';
import styles from '@larose-ui/styles/components/TabView/TabView.module.css';
import { cn } from '../../utils/cn';
import { tabViewKey } from '../../composables/useTabView';

const props = withDefaults(
  defineProps<{
    value?: string;
    defaultValue?: string;
    variant?: TabViewVariant;
    showTabs?: boolean;
    inset?: boolean;
    class?: string;
    style?: Record<string, string | number>;
    'aria-label'?: string;
  }>(),
  {
    defaultValue: '',
    variant: 'bordered',
    showTabs: true,
    inset: true,
    'aria-label': 'Tab view',
  },
);

const emit = defineEmits<{ valueChange: [value: string] }>();
const internal = ref(props.defaultValue);
const current = computed(() => (props.value !== undefined ? props.value : internal.value));
const baseId = useId();

function onValueChange(next: string) {
  if (props.value === undefined) internal.value = next;
  emit('valueChange', next);
}

provide(tabViewKey, { value: current as any, onValueChange, baseId });
</script>

<template>
  <div
    :class="cn(styles.tabView, props.class)"
    :style="props.style"
    :data-variant="variant"
    :data-inset="inset ? 'true' : undefined"
    :aria-label="props['aria-label']"
  >
    <slot v-if="showTabs" name="list" />
    <div :class="styles.content">
      <slot />
    </div>
  </div>
</template>
