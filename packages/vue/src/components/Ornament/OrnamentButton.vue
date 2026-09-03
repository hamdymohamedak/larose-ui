<script setup lang="ts">
import styles from '@larose-ui/styles/components/Ornament/Ornament.module.css';
import { cn } from '../../utils/cn';

defineProps<{
  active?: boolean;
  class?: string;
  disabled?: boolean;
}>();
</script>

<template>
  <button
    type="button"
    :class="cn(styles.borderlessButton, $props.class)"
    :data-active="active ? 'true' : undefined"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>
