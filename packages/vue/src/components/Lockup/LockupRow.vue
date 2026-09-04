<script setup lang="ts">
import type { CSSProperties } from 'vue';
import styles from '@larose-ui/styles/components/Lockup/Lockup.module.css';
import { cn } from '../../utils/cn';

defineProps<{ class?: string; style?: CSSProperties }>();
</script>

<template>
  <div :class="cn(styles.row, $props.class)" :style="$props.style">
    <slot />
  </div>
</template>
