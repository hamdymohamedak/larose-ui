<script setup lang="ts">
import Popover from '../../../packages/vue/src/components/Popover/Popover.vue';
import type { PopoverSide } from '../../../packages/vue/src/components/Popover/Popover.vue';

withDefaults(
  defineProps<{
    side?: PopoverSide;
    open?: boolean;
    triggerLabel?: string;
    contentText?: string;
  }>(),
  {
    side: 'bottom',
    open: true,
    triggerLabel: 'Show info',
    contentText: 'Popovers present supplementary content anchored to a trigger.',
  },
);
</script>

<template>
  <Popover :side="side" :open="open" aria-label="Popover demo">
    <template #trigger>
      <button type="button">{{ triggerLabel }}</button>
    </template>
    <template #content>
      <p style="margin: 0; max-width: 220px">{{ contentText }}</p>
    </template>
  </Popover>
</template>
