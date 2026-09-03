<script setup lang="ts">
import type { CSSProperties } from 'vue';
import styles from '@larose-ui/styles/components/Lockup/Lockup.module.css';
import { cn } from '../../utils/cn';

defineProps<{
  title: string;
  subtitle?: string;
  imageUrl: string;
  class?: string;
  style?: CSSProperties;
}>();
</script>

<template>
  <figure :class="cn(styles.posterFrame, $props.class)" :style="$props.style">
    <img :src="imageUrl" :alt="title" :class="styles.posterImage" />
    <figcaption :class="styles.posterMeta">
      <div :class="styles.posterTitle">{{ title }}</div>
      <div v-if="subtitle" :class="styles.posterSubtitle">{{ subtitle }}</div>
    </figcaption>
  </figure>
</template>
