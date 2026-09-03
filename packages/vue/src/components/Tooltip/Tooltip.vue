<script setup lang="ts">
import { useId, ref } from 'vue';
import type { CSSProperties } from 'vue';
import styles from '@larose-ui/styles/components/Tooltip/Tooltip.module.css';
import { cn } from '../../utils/cn';

export type TooltipSide = 'top' | 'bottom' | 'left' | 'right';

withDefaults(
  defineProps<{
    content?: unknown;
    side?: TooltipSide;
    class?: string;
    style?: CSSProperties;
  }>(),
  {
    side: 'top',
  },
);

const visible = ref(false);
const tooltipId = useId();
</script>

<template>
  <span
    :class="cn(styles.wrapper, $props.class)"
    :style="style"
    @mouseenter="visible = true"
    @mouseleave="visible = false"
    @focusin="visible = true"
    @focusout="visible = false"
  >
    <span :aria-describedby="visible ? tooltipId : undefined">
      <slot />
    </span>
    <span
      v-if="visible"
      :id="tooltipId"
      role="tooltip"
      :class="styles.tooltip"
      :data-side="side"
    >
      <slot name="content">{{ content }}</slot>
    </span>
  </span>
</template>
