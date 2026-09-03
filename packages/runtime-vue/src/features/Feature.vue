<script setup lang="ts">
import { useFeature } from './context';

const props = defineProps<{ name: string }>();
const state = useFeature(props.name);
</script>

<template>
  <span v-if="state.loading" aria-busy="true" :data-feature="name" />
  <slot v-else-if="state.enabled" />
  <slot v-else name="fallback" />
</template>
