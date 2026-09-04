<script setup lang="ts">
import { computed } from 'vue';
import type { CSSProperties } from 'vue';
import styles from '@larose-ui/styles/components/Skeleton/Skeleton.module.css';
import { cn } from '../../utils/cn';

const props = withDefaults(
  defineProps<{
    width?: string | number;
    height?: string | number;
    variant?: 'text' | 'circular' | 'rectangular';
    lines?: number;
    class?: string;
    style?: CSSProperties;
  }>(),
  {
    width: '100%',
    height: '1rem',
    variant: 'text',
    lines: 1,
  },
);

function lineStyle(index: number): CSSProperties {
  return {
    width: index === props.lines - 1 ? '70%' : props.width,
    height: props.height,
  };
}

const singleStyle = computed(
  () =>
    ({
      width: props.width,
      height: props.variant === 'circular' ? props.width : props.height,
      ...props.style,
    }) as CSSProperties,
);
</script>

<template>
  <div
    v-if="lines > 1"
    :class="cn(styles.group, $props.class)"
    :style="style"
    aria-hidden="true"
  >
    <div
      v-for="(_, i) in lines"
      :key="i"
      :class="styles.skeleton"
      data-variant="text"
      :style="lineStyle(i)"
    />
  </div>
  <div
    v-else
    :class="cn(styles.skeleton, $props.class)"
    :data-variant="variant"
    :style="singleStyle"
    aria-hidden="true"
  />
</template>
