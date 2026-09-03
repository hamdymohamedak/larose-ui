<script setup lang="ts">
import type { CSSProperties } from 'vue';
import styles from '@larose-ui/styles/components/DockMenu/DockMenu.module.css';
import { cn } from '../../utils/cn';

defineProps<{
  class?: string;
  style?: CSSProperties;
  'aria-label'?: string;
}>();
</script>

<template>
  <div
    :class="cn(styles.dockBar, $props.class)"
    :style="$props.style"
    role="toolbar"
    :aria-label="$props['aria-label'] ?? 'Dock'"
  >
    <slot />
  </div>
</template>
