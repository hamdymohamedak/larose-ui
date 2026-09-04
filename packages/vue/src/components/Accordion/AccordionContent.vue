<script setup lang="ts">
import { computed, type CSSProperties } from 'vue';
import styles from '@larose-ui/styles/components/Accordion/Accordion.module.css';
import { cn } from '../../utils/cn';
import { useAccordionContext, useAccordionItemContext } from './context';

const props = defineProps<{ class?: string; style?: CSSProperties }>();
const ctx = useAccordionContext('AccordionContent');
const itemValue = useAccordionItemContext('AccordionContent');
const open = computed(() => ctx.openItems.value.has(itemValue));
const triggerId = computed(() => `${ctx.baseId}-trigger-${itemValue}`);
const contentId = computed(() => `${ctx.baseId}-content-${itemValue}`);
</script>

<template>
  <div
    v-show="open"
    :id="contentId"
    role="region"
    :aria-labelledby="triggerId"
    :class="cn(styles.content, props.class)"
    :style="props.style"
  >
    <slot />
  </div>
</template>
