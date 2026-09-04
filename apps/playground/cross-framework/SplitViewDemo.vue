<script setup lang="ts">
import SplitView from '../../../packages/vue/src/components/SplitView/SplitView.vue';
import SplitViewPane from '../../../packages/vue/src/components/SplitView/SplitViewPane.vue';
import type { SplitOrientation } from '../../../packages/vue/src/SplitView/types';

withDefaults(
  defineProps<{
    orientation?: SplitOrientation;
    leftLabel?: string;
    rightLabel?: string;
  }>(),
  {
    orientation: 'horizontal',
    leftLabel: 'Sidebar',
    rightLabel: 'Detail content',
  },
);
</script>

<template>
  <SplitView
    :orientation="orientation"
    storage-key="storybook-split-demo"
    aria-label="Split view demo"
    style="min-height: 16rem; border: 1px solid var(--lr-color-border, #e4e4e7); border-radius: 0.75rem; overflow: hidden"
  >
    <SplitViewPane id="sidebar" label="Sidebar" :default-size="32" :min-size="140">
      <div style="padding: 0.75rem; font-size: 0.875rem">
        <strong style="display: block; margin-bottom: 0.5rem">{{ leftLabel }}</strong>
        <p style="margin: 0; opacity: 0.75">Drag the divider to resize panes.</p>
      </div>
    </SplitViewPane>
    <SplitViewPane id="content" label="Content" :default-size="68" :min-size="180">
      <div style="padding: 0.75rem; font-size: 0.875rem">
        <strong style="display: block; margin-bottom: 0.5rem">{{ rightLabel }}</strong>
        <p style="margin: 0; opacity: 0.75">Secondary pane updates with Storybook controls.</p>
      </div>
    </SplitViewPane>
  </SplitView>
</template>
