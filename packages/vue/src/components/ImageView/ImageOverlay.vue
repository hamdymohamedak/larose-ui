<script setup lang="ts">
import type { CSSProperties } from 'vue';
import styles from '@larose-ui/styles/components/ImageView/ImageView.module.css';
import { cn } from '../../utils/cn';

defineProps<{ src: string; alt: string; class?: string; style?: CSSProperties }>();
</script>

<template>
  <div :class="cn(styles.overlay, $props.class)" :style="$props.style">
    <img :src="src" :alt="alt" :class="styles.overlayImage" />
    <div :class="styles.overlayScrim" aria-hidden="true" />
    <div :class="styles.overlayContent"><slot /></div>
  </div>
</template>
