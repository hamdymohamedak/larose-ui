<script setup lang="ts">
import type { MenuEntry, MenuItemConfig } from '../../Menu/types';
import PullDownButton from './PullDownButton.vue';
defineProps<{
  entries: MenuEntry[]; menuTitle?: string; disabled?: boolean; longPress?: boolean;
  'aria-label'?: string; class?: string; style?: Record<string, string | number>;
}>();
const emit = defineEmits<{ action: [MenuItemConfig] }>();
</script>
<template>
  <PullDownButton variant="more" :label="$props['aria-label'] ?? 'More'" :entries="entries" :menu-title="menuTitle" :disabled="disabled" :long-press="longPress" :class="$props.class" :style="$props.style" @action="emit('action', $event)" />
</template>
