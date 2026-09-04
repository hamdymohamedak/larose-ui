<script setup lang="ts">
import type { CSSProperties } from 'vue';
import styles from '@larose-ui/styles/components/Lockup/Lockup.module.css';
import { cn } from '../../utils/cn';
import { formatRating } from '../../Lockup/utils';

const props = defineProps<{
  title: string;
  rating?: number;
  reviewCount?: number;
  class?: string;
  style?: CSSProperties;
}>();
</script>

<template>
  <article :class="cn(styles.card, props.class)" :style="props.style">
    <div :class="styles.cardBody">
      <h3 :class="styles.headerTitle">{{ title }}</h3>
      <p v-if="rating != null" :class="styles.rating">{{ formatRating(rating) }}</p>
      <p v-if="reviewCount != null" :class="styles.review">{{ reviewCount }} reviews</p>
      <slot />
    </div>
  </article>
</template>
