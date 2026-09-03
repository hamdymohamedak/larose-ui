<script setup lang="ts">
import styles from '@larose-ui/styles/components/EditMenu/EditMenu.module.css';
import { cn } from '../../utils/cn';

const props = withDefaults(
  defineProps<{
    selected?: boolean;
    class?: string;
  }>(),
  { selected: false },
);
</script>

<template>
  <div
    :class="cn(styles.selectionPreview, props.class)"
    :data-selected="selected ? 'true' : undefined"
  >
    <slot />
  </div>
</template>
