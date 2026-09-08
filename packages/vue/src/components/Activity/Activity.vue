<script setup lang="ts">
import styles from '@larose-ui/styles/components/Activity/Activity.module.css';

defineProps<{
  class?: string;
}>();
</script>

<template>
  <!-- TODO: implement Activity for @larose-ui/vue -->
  <div :class="[styles.root, $props.class].filter(Boolean)" :data-larose="'Activity'">
    <slot />
  </div>
</template>
