<script setup lang="ts">
import Button from '../../../packages/vue/src/components/Button/Button.vue';
import ButtonGroup from '../../../packages/vue/src/components/Button/ButtonGroup.vue';

withDefaults(
  defineProps<{
    orientation?: 'horizontal' | 'vertical';
    fullWidth?: boolean;
    ariaLabel?: string;
  }>(),
  {
    orientation: 'horizontal',
    fullWidth: false,
    ariaLabel: 'Save options',
  },
);
</script>

<template>
  <ButtonGroup :orientation="orientation" :full-width="fullWidth" :aria-label="ariaLabel">
    <Button variant="primary" button-role="primary" :full-width="fullWidth">Save</Button>
    <Button variant="secondary" :full-width="fullWidth">Save As…</Button>
    <Button variant="secondary" button-role="cancel" :full-width="fullWidth">Cancel</Button>
  </ButtonGroup>
</template>
