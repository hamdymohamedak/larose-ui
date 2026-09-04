<script setup lang="ts">
import type { CSSProperties } from 'vue';
import styles from '@larose-ui/styles/components/Button/Button.module.css';
import { cn } from '../../utils/cn';

withDefaults(
  defineProps<{
    orientation?: 'horizontal' | 'vertical';
    fullWidth?: boolean;
    class?: string;
    style?: CSSProperties;
    ariaLabel?: string;
  }>(),
  {
    orientation: 'horizontal',
    fullWidth: false,
  },
);
</script>

<template>
  <div
    :class="cn(styles.group, $props.class)"
    :style="style"
    :data-orientation="orientation"
    :data-full-width="fullWidth ? 'true' : undefined"
    role="group"
    :aria-label="ariaLabel"
  >
    <slot />
  </div>
</template>
