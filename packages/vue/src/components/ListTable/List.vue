<script setup lang="ts">
import type { ListVariant } from '../../ListTable/types';
import styles from '@larose-ui/styles/components/ListTable/ListTable.module.css';
import { cn } from '../../utils/cn';
withDefaults(defineProps<{ variant?: ListVariant; class?: string; style?: Record<string, string | number>; 'aria-label'?: string }>(), { variant: 'grouped' });
</script>
<template>
  <div :class="cn(styles.list, $props.class)" :style="$props.style" :data-variant="variant" role="list" :aria-label="$props['aria-label']"><slot /></div>
</template>
