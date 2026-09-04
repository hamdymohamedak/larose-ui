<script setup lang="ts">
import type { CSSProperties } from 'vue';
import styles from '@larose-ui/styles/components/ImageView/ImageView.module.css';
import { cn } from '../../utils/cn';

defineProps<{ src: string; alt: string; class?: string; style?: CSSProperties; ariaLabel?: string }>();
const emit = defineEmits<{ click: [] }>();
</script>

<template>
  <button
    type="button"
    :class="cn(styles.imageButton, $props.class)"
    :style="$props.style"
    :aria-label="ariaLabel ?? alt"
    @click="emit('click')"
  >
    <img :src="src" :alt="alt" :class="styles.imageButtonImage" />
  </button>
</template>
