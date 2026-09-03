<script setup lang="ts">
import styles from '@larose-ui/styles/components/Sidebar/Sidebar.module.css';
import { cn } from '../../utils/cn';
defineProps<{ class?: string; style?: Record<string, string | number> }>();
</script>
<template>
  <div :class="cn(styles.header, $props.class)" :style="$props.style"><slot /></div>
</template>
