<script setup lang="ts">
import { onMounted, onUnmounted, provide } from 'vue';
import type { AcceleratorPlatform } from '@larose-ui/core';
import {
  acceleratorKey,
  createAcceleratorContextValue,
} from '../../composables/useAccelerator';

const props = defineProps<{ platform?: AcceleratorPlatform }>();
const context = createAcceleratorContextValue(props.platform);
provide(acceleratorKey, context);

let detach: (() => void) | undefined;

onMounted(() => {
  const onKeyDown = (event: KeyboardEvent) => {
    const activeMenuId = context.activeMenuId.current;
    if (activeMenuId) {
      const menuHandler = context.menuHandlers.get(activeMenuId);
      if (menuHandler?.(event)) return;
    }
    context.registry.handleEvent(event, {
      platform: context.platform,
      scopes: ['component', 'global'],
      target: event.target,
    });
  };
  window.addEventListener('keydown', onKeyDown, true);
  detach = () => window.removeEventListener('keydown', onKeyDown, true);
});

onUnmounted(() => detach?.());
</script>

<template>
  <slot />
</template>
