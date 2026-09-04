<script setup lang="ts">
import styles from '@larose-ui/styles/components/Toolbar/Toolbar.module.css';
import { cn } from '../../utils/cn';
import { SearchIcon } from './icons';
const props = withDefaults(defineProps<{
  modelValue?: string; placeholder?: string; 'aria-label'?: string; class?: string; style?: Record<string, string | number>;
}>(), { placeholder: 'Search', 'aria-label': 'Search', modelValue: '' });
const emit = defineEmits<{ 'update:modelValue': [string]; change: [string] }>();
</script>
<template>
  <label :class="cn(styles.searchWrap, props.class)" :style="props.style">
    <SearchIcon />
    <input type="search" :class="styles.searchInput" :value="modelValue" :placeholder="placeholder" :aria-label="props['aria-label']"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value); emit('change', ($event.target as HTMLInputElement).value)" />
  </label>
</template>
