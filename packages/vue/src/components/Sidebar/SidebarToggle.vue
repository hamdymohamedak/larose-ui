<script setup lang="ts">
import styles from '@larose-ui/styles/components/Sidebar/Sidebar.module.css';
import { cn } from '../../utils/cn';
withDefaults(defineProps<{ hidden?: boolean; label?: string; class?: string; style?: Record<string, string | number> }>(), { label: 'Toggle sidebar' });
const emit = defineEmits<{ toggle: [] }>();
</script>
<template>
  <button type="button" :class="cn(styles.toggle, $props.class)" :style="$props.style" :aria-pressed="!hidden" @click="emit('toggle')">
    {{ hidden ? 'Show Sidebar' : 'Hide Sidebar' }}
    <span class="sr-only">{{ label }}</span>
  </button>
</template>
