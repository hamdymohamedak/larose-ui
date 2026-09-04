<script setup lang="ts">
import { computed, ref, useId, type CSSProperties } from 'vue';
import styles from '@larose-ui/styles/components/Tabs/Tabs.module.css';
import { cn } from '../../utils/cn';
import { provideTabs } from './context';

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    defaultValue?: string;
    class?: string;
    style?: CSSProperties;
  }>(),
  { defaultValue: '' },
);

const emit = defineEmits<{ 'update:modelValue': [value: string] }>();
const internal = ref(props.defaultValue);
const current = computed(() => (props.modelValue !== undefined ? props.modelValue : internal.value));
const baseId = useId();

function onValueChange(next: string) {
  if (props.modelValue === undefined) internal.value = next;
  emit('update:modelValue', next);
}

provideTabs({ value: current as any, onValueChange, baseId });
</script>

<template>
  <div :class="cn(styles.tabs, props.class)" :style="props.style">
    <slot />
  </div>
</template>
