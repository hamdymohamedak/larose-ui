<script setup lang="ts">
import styles from '@larose-ui/styles/components/Sidebar/Sidebar.module.css';
import { cn } from '../../utils/cn';
defineProps<{ class?: string; style?: Record<string, string | number>; 'aria-label'?: string }>();
</script>
<template>
  <nav :class="cn(styles.nav, $props.class)" :style="$props.style" :aria-label="$props['aria-label'] ?? 'Sidebar navigation'"><slot /></nav>
</template>
