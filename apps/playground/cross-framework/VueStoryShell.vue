<script setup lang="ts">
import { computed, type Component } from 'vue';
import LaRoseProvider from '../../../packages/vue/src/provider/LaRoseProvider.vue';
import * as components from './vueComponents';

const props = withDefaults(
  defineProps<{
    componentName: keyof typeof components;
    componentProps?: Record<string, unknown>;
    slotText?: string;
    theme?: 'light' | 'dark';
    density?: 'compact' | 'comfortable' | 'spacious';
  }>(),
  {
    componentProps: () => ({}),
    theme: 'light',
    density: 'comfortable',
  },
);

const ResolvedComponent = computed(
  () => components[props.componentName] as Component,
);
</script>

<template>
  <LaRoseProvider :theme="theme" :density="density">
    <component :is="ResolvedComponent" v-bind="componentProps">
      <template v-if="slotText" #default>{{ slotText }}</template>
      <!-- DockMenu / similar chrome use a named icon slot -->
      <template v-if="slotText" #icon>{{ slotText }}</template>
    </component>
  </LaRoseProvider>
</template>
