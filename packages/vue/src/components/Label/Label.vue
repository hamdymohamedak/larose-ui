<script setup lang="ts">
import type { LabelImportance } from './types';
import styles from '@larose-ui/styles/components/Label/Label.module.css';
import { cn } from '../../utils/cn';

withDefaults(
  defineProps<{
    importance?: LabelImportance;
    selectable?: boolean;
    mono?: boolean;
    as?: string;
    class?: string;
  }>(),
  {
    importance: 'primary',
    selectable: false,
    mono: false,
    as: 'span',
  },
);
</script>

<template>
  <component
    :is="as"
    :class="cn(styles.root, styles[importance], $props.class)"
    :data-importance="importance"
    :data-selectable="selectable ? 'true' : undefined"
    :data-mono="mono ? 'true' : undefined"
  >
    <slot />
  </component>
</template>
