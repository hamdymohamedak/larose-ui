<script setup lang="ts">
import styles from '@larose-ui/styles/components/Sidebar/Sidebar.module.css';
import { cn } from '../../utils/cn';
import SearchField from '../SearchField/SearchField.vue';
defineProps<{ class?: string; style?: Record<string, string | number>; modelValue?: string; placeholder?: string }>();
const emit = defineEmits<{ 'update:modelValue': [string]; change: [string]; search: [string] }>();
</script>
<template>
  <div :class="cn(styles.search, $props.class)" :style="$props.style">
    <SearchField placement="sidebar-top" platform="macos" :model-value="modelValue" :placeholder="placeholder"
      @update:model-value="emit('update:modelValue', $event)" @change="emit('change', $event)" @search="emit('search', $event)" />
  </div>
</template>
