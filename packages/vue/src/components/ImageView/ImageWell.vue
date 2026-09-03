<script setup lang="ts">
import { useId, type CSSProperties } from 'vue';
import styles from '@larose-ui/styles/components/ImageView/ImageView.module.css';
import { cn } from '../../utils/cn';

const props = defineProps<{
  src?: string;
  alt?: string;
  accept?: string;
  disabled?: boolean;
  class?: string;
  style?: CSSProperties;
  placeholder?: string;
}>();
const emit = defineEmits<{ change: [file: File | null] }>();
const inputId = useId();

function onChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0] ?? null;
  emit('change', file);
}
</script>

<template>
  <label :class="cn(styles.well, props.class)" :style="props.style" :for="inputId">
    <img v-if="src" :src="src" :alt="alt ?? ''" />
    <span v-else :class="styles.wellPlaceholder">{{ placeholder ?? 'Drop image' }}</span>
    <input
      :id="inputId"
      type="file"
      :accept="accept ?? 'image/*'"
      :disabled="disabled"
      :class="styles.wellInput"
      @change="onChange"
    />
  </label>
</template>
