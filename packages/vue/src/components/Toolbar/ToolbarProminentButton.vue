<script setup lang="ts">
import styles from '@larose-ui/styles/components/Toolbar/Toolbar.module.css';
import { cn } from '../../utils/cn';
defineProps<{ disabled?: boolean; class?: string; style?: Record<string, string | number> }>();
const emit = defineEmits<{ click: [] }>();
</script>
<template>
  <button type="button" :class="cn(styles.prominent, $props.class)" :style="$props.style" :disabled="disabled" @click="emit('click')">
    <slot />
  </button>
</template>
