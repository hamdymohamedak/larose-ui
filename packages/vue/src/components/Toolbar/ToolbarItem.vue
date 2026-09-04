<script setup lang="ts">
import styles from '@larose-ui/styles/components/Toolbar/Toolbar.module.css';
import { cn } from '../../utils/cn';
import { useToolbarPlatform } from '../../composables/useToolbarPlatform';
import ToolbarProminentButton from './ToolbarProminentButton.vue';
const props = withDefaults(defineProps<{
  id?: string; label: string; showLabel?: boolean; prominent?: boolean; disabled?: boolean; collapsible?: boolean;
  class?: string; style?: Record<string, string | number>;
}>(), { showLabel: false, prominent: false, disabled: false });
const emit = defineEmits<{ click: [] }>();
const platform = useToolbarPlatform();
</script>
<template>
  <ToolbarProminentButton v-if="prominent" :disabled="disabled" :class="props.class" :style="props.style" @click="emit('click')">{{ label }}</ToolbarProminentButton>
  <button v-else type="button" :class="cn(styles.item, props.class)" :style="props.style" :data-platform="platform" :data-show-label="showLabel ? 'true' : undefined" :aria-label="showLabel ? undefined : label" :disabled="disabled" @click="emit('click')">
    <span v-if="$slots.icon" :class="styles.itemIcon"><slot name="icon" /></span>
    <span v-if="showLabel">{{ label }}</span>
  </button>
</template>
