<script setup lang="ts">
import Card from '../../../packages/vue/src/components/Card/Card.vue';
import Button from '../../../packages/vue/src/components/Button/Button.vue';

withDefaults(
  defineProps<{
    title?: string;
    description?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    bodyText?: string;
    footerLabel?: string;
  }>(),
  {
    padding: 'md',
    bodyText: 'Card body content',
  },
);
</script>

<template>
  <Card :title="title" :description="description" :padding="padding">
    {{ bodyText }}
    <template v-if="footerLabel" #footer>
      <Button size="sm">{{ footerLabel }}</Button>
    </template>
  </Card>
</template>
