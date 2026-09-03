<script setup lang="ts">
import { computed, type CSSProperties } from 'vue';
import styles from '@larose-ui/styles/components/Accordion/Accordion.module.css';
import { cn } from '../../utils/cn';
import { provideAccordionItem, useAccordionContext } from './context';

const props = defineProps<{
  value: string;
  disabled?: boolean;
  class?: string;
  style?: CSSProperties;
}>();

const ctx = useAccordionContext('AccordionItem');
provideAccordionItem(props.value);
const open = computed(() => ctx.openItems.value.has(props.value));
</script>

<template>
  <div
    :class="cn(styles.item, props.class)"
    :style="props.style"
    :data-state="open ? 'open' : 'closed'"
    :data-disabled="disabled ? 'true' : undefined"
  >
    <slot />
  </div>
</template>
