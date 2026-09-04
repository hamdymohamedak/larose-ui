<script setup lang="ts">
import { computed, ref, toRef, useId, type CSSProperties } from 'vue';
import styles from '@larose-ui/styles/components/Accordion/Accordion.module.css';
import { cn } from '../../utils/cn';
import { provideAccordion } from './context';

const props = withDefaults(
  defineProps<{
    type?: 'single' | 'multiple';
    collapsible?: boolean;
    modelValue?: string[];
    defaultValue?: string[];
    class?: string;
    style?: CSSProperties;
  }>(),
  { type: 'single', collapsible: false, defaultValue: () => [] },
);

const emit = defineEmits<{ 'update:modelValue': [value: string[]] }>();
const internal = ref([...props.defaultValue]);
const openItems = computed(() => new Set(props.modelValue ?? internal.value));
const baseId = useId();
const typeRef = toRef(props, 'type');
const collapsibleRef = toRef(props, 'collapsible');

function toggleItem(itemValue: string) {
  const next = new Set(openItems.value);
  const isOpen = next.has(itemValue);
  if (props.type === 'single') {
    next.clear();
    if (!isOpen || !props.collapsible) next.add(itemValue);
  } else if (isOpen) next.delete(itemValue);
  else next.add(itemValue);
  const arr = Array.from(next);
  if (props.modelValue === undefined) internal.value = arr;
  emit('update:modelValue', arr);
}

provideAccordion({
  type: typeRef as any,
  collapsible: collapsibleRef as any,
  openItems: openItems as any,
  toggleItem,
  baseId,
});
</script>

<template>
  <div :class="cn(styles.accordion, props.class)" :style="props.style">
    <slot />
  </div>
</template>
