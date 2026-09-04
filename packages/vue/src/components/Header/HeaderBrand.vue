<script setup lang="ts">
import type { CSSProperties } from 'vue';
import styles from '@larose-ui/styles/components/Header/Header.module.css';
import { cn } from '../../utils/cn';

defineProps<{ class?: string; style?: CSSProperties }>();
</script>

<template>
  <div :class="cn(styles.brand, $props.class)" :style="$props.style">
    <slot />
  </div>
</template>
