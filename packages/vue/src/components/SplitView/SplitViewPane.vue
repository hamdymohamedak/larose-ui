<script setup lang="ts">
import { inject, onUnmounted, useSlots, watchEffect, type Slot } from 'vue';
import { defineComponent } from 'vue';

defineOptions({ name: 'SplitViewPane' });

const props = withDefaults(
  defineProps<{
    id: string;
    label?: string;
    minSize?: number;
    maxSize?: number;
    defaultSize?: number;
    collapsible?: boolean;
    visible?: boolean;
    defaultVisible?: boolean;
    class?: string;
    'aria-label'?: string;
  }>(),
  {
    minSize: 120,
    maxSize: 960,
    defaultSize: 1,
    collapsible: false,
    defaultVisible: true,
  },
);

const slots = useSlots() as { default?: Slot };
const registry = inject<{
  registerPane: (pane: Record<string, unknown>) => void;
  unregisterPane: (id: string) => void;
} | null>('larose-split-view-register', null);

const SlotRender = defineComponent({
  name: 'SplitViewPaneSlot',
  setup() {
    return () => slots.default?.() ?? null;
  },
});

watchEffect(() => {
  registry?.registerPane({
    id: props.id,
    label: props.label,
    minSize: props.minSize,
    maxSize: props.maxSize,
    defaultSize: props.defaultSize,
    collapsible: props.collapsible,
    defaultVisible: props.defaultVisible,
    visible: props.visible,
    class: props.class,
    ariaLabel: props['aria-label'],
    slot: SlotRender,
  });
});

onUnmounted(() => registry?.unregisterPane(props.id));
</script>

<template>
  <!-- Registers with parent SplitView; content rendered by parent -->
  <span style="display: none" aria-hidden="true" />
</template>
