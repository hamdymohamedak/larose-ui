<script setup lang="ts">
import type { CSSProperties } from 'vue';
import styles from '@larose-ui/styles/components/Ornament/Ornament.module.css';
import { cn } from '../../utils/cn';

defineProps<{
  class?: string;
  style?: CSSProperties;
}>();
</script>

<template>
  <div
    :class="cn(styles.ornament, $props.class)"
    :style="$props.style"
    role="toolbar"
  >
    <div :class="styles.ornamentInner">
      <slot />
    </div>
  </div>
</template>
