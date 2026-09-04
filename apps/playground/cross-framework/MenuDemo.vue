<script setup lang="ts">
import Menu from '../../../packages/vue/src/components/Menu/Menu.vue';
import Button from '../../../packages/vue/src/components/Button/Button.vue';
import type { MenuEntry, MenuLayout } from '../../../packages/vue/src/Menu/types';

withDefaults(
  defineProps<{
    open?: boolean;
    title?: string;
    layout?: MenuLayout;
    entries?: MenuEntry[];
    triggerLabel?: string;
    showTrigger?: boolean;
  }>(),
  {
    open: true,
    title: 'Actions',
    layout: 'large',
    entries: () => [
      { id: 'cut', label: 'Cut' },
      { id: 'copy', label: 'Copy' },
      { id: 'paste', label: 'Paste' },
      { type: 'separator' },
      { id: 'select-all', label: 'Select All' },
    ],
    triggerLabel: 'Open menu',
    showTrigger: true,
  },
);
</script>

<template>
  <div style="min-height: 16rem; display: flex; align-items: center; justify-content: center">
    <Menu
      v-if="showTrigger"
      :entries="entries"
      :open="open"
      :title="title"
      :layout="layout"
      @open-change="() => undefined"
    >
      <Button variant="secondary">{{ triggerLabel }}</Button>
    </Menu>
    <Menu
      v-else
      :entries="entries"
      :open="open"
      :title="title"
      :layout="layout"
      @open-change="() => undefined"
    />
  </div>
</template>
