<script setup lang="ts">
import type { CSSProperties } from 'vue';
import styles from '@larose-ui/styles/components/Tabs/Tabs.module.css';
import { cn } from '../../utils/cn';

const props = withDefaults(
  defineProps<{ class?: string; style?: CSSProperties; ariaLabel?: string }>(),
  { ariaLabel: 'Tabs' },
);
</script>

<template>
  <div :class="cn(styles.list, props.class)" :style="props.style" role="tablist" :aria-label="ariaLabel">
    <slot />
  </div>
</template>
