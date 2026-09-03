<script setup lang="ts">
import styles from '@larose-ui/styles/components/ListTable/ListTable.module.css';
import { cn } from '../../utils/cn';
withDefaults(defineProps<{
  modelValue?: string; searchQuery?: string; placeholder?: string; class?: string; style?: Record<string, string | number>; 'aria-label'?: string;
}>(), { placeholder: 'Search', 'aria-label': 'Search outline view' });
const emit = defineEmits<{ 'update:modelValue': [string]; searchChange: [string] }>();
function onInput(v: string) { emit('update:modelValue', v); emit('searchChange', v); }
</script>
<template>
  <div :class="cn(styles.outlineToolbar, $props.class)" :style="$props.style">
    <input type="search" :class="styles.outlineSearch" :value="modelValue ?? searchQuery ?? ''" :placeholder="placeholder" :aria-label="$props['aria-label']" @input="onInput(($event.target as HTMLInputElement).value)" />
  </div>
</template>
