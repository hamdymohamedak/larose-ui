<script setup lang="ts">
import styles from '@larose-ui/styles/components/Sidebar/Sidebar.module.css';
defineProps<{ label: string; class?: string; style?: Record<string, string | number> }>();
</script>
<template>
  <div :class="$props.class" :style="$props.style" role="group" :aria-label="label">
    <div :class="styles.groupLabel">{{ label }}</div>
    <slot />
  </div>
</template>
