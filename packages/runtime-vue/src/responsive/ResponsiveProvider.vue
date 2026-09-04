<script setup lang="ts">
import { defaultBreakpoints, type BreakpointConfig } from '@larose-ui/runtime-core';
import { provideResponsive } from './context';

const props = withDefaults(
  defineProps<{ breakpoints?: BreakpointConfig }>(),
  { breakpoints: () => defaultBreakpoints },
);

provideResponsive(props.breakpoints);
</script>

<template>
  <slot />
</template>
