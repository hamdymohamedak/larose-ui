<script setup lang="ts">
import SquareButton from '../../../packages/vue/src/components/Button/SquareButton.vue';
</script>

<template>
  <div style="display: flex; gap: 0.5rem; align-items: center">
    <SquareButton aria-label="Add row" tooltip="Add row">+</SquareButton>
    <SquareButton aria-label="Remove row" tooltip="Remove row">−</SquareButton>
  </div>
</template>
