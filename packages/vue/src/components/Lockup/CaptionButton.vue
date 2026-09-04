<script setup lang="ts">
import type { CSSProperties } from 'vue';
import styles from '@larose-ui/styles/components/Lockup/Lockup.module.css';
import { cn } from '../../utils/cn';

defineProps<{
  label: string;
  imageUrl?: string;
  class?: string;
  style?: CSSProperties;
}>();
const emit = defineEmits<{ click: [] }>();
</script>

<template>
  <button type="button" :class="cn(styles.captionSurface, $props.class)" :style="$props.style" @click="emit('click')">
    <img v-if="imageUrl" :src="imageUrl" alt="" :class="styles.captionImage" />
    <span :class="styles.captionText">{{ label }}</span>
  </button>
</template>
