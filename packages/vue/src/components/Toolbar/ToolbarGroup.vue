<script setup lang="ts">
import styles from '@larose-ui/styles/components/Toolbar/Toolbar.module.css';
import { cn } from '../../utils/cn';
import { useToolbarPlatform } from '../../composables/useToolbarPlatform';
defineProps<{ class?: string; style?: Record<string, string | number> }>();
const platform = useToolbarPlatform();
</script>
<template>
  <div :class="cn(styles.group, $props.class)" :style="$props.style" :data-platform="platform" role="group">
    <slot />
  </div>
</template>
