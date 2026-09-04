<script setup lang="ts">
import type { CSSProperties } from 'vue';
import styles from '@larose-ui/styles/components/SearchField/SearchField.module.css';
import { cn } from '../../utils/cn';
import type { SearchScopeOption } from '../../SearchField/types';

defineProps<{
  options: SearchScopeOption[];
  modelValue: string;
  class?: string;
  style?: CSSProperties;
}>();
const emit = defineEmits<{ 'update:modelValue': [value: string] }>();
</script>

<template>
  <div :class="cn(styles.scopeBar, $props.class)" :style="$props.style" role="tablist" aria-label="Search scope">
    <button
      v-for="option in options"
      :key="option.id"
      type="button"
      role="tab"
      :class="styles.scopeOption"
      :data-selected="option.id === modelValue ? 'true' : undefined"
      :aria-selected="option.id === modelValue"
      @click="emit('update:modelValue', option.id)"
    >
      {{ option.label }}
    </button>
  </div>
</template>
