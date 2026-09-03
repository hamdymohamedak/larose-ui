<script setup lang="ts">
import { computed, type CSSProperties } from 'vue';
import styles from '@larose-ui/styles/components/Accordion/Accordion.module.css';
import { cn } from '../../utils/cn';
import { useAccordionContext, useAccordionItemContext } from './context';

const props = defineProps<{ disabled?: boolean; class?: string; style?: CSSProperties }>();
const ctx = useAccordionContext('AccordionTrigger');
const itemValue = useAccordionItemContext('AccordionTrigger');
const open = computed(() => ctx.openItems.value.has(itemValue));
const triggerId = computed(() => `${ctx.baseId}-trigger-${itemValue}`);
const contentId = computed(() => `${ctx.baseId}-content-${itemValue}`);
</script>

<template>
  <button
    type="button"
    :id="triggerId"
    :aria-expanded="open"
    :aria-controls="contentId"
    :disabled="disabled"
    :data-state="open ? 'open' : 'closed'"
    :class="cn(styles.trigger, props.class)"
    :style="props.style"
    @click="ctx.toggleItem(itemValue)"
  >
    <span><slot /></span>
    <span :class="styles.icon" aria-hidden="true">{{ open ? '▾' : '▸' }}</span>
  </button>
</template>
