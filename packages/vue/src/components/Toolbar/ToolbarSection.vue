<script setup lang="ts">
import styles from '@larose-ui/styles/components/Toolbar/Toolbar.module.css';
import { cn } from '../../utils/cn';
import type { ToolbarSectionPlacement } from '../../Toolbar/types';
const props = withDefaults(defineProps<{
  placement: ToolbarSectionPlacement; collapsible?: boolean; class?: string; style?: Record<string, string | number>;
}>(), { collapsible: undefined });
const sectionClass = () => props.placement === 'leading' ? styles.leading : props.placement === 'center' ? styles.center : styles.trailing;
</script>
<template>
  <div :class="cn(sectionClass(), props.class)" :style="props.style">
    <div :class="placement === 'center' ? styles.centerInner : undefined"><slot /></div>
  </div>
</template>
