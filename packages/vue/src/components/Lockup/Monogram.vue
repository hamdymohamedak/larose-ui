<script setup lang="ts">
import type { CSSProperties } from 'vue';
import styles from '@larose-ui/styles/components/Lockup/Lockup.module.css';
import { cn } from '../../utils/cn';
import { getInitials } from '../../Lockup/utils';

const props = defineProps<{
  name: string;
  imageUrl?: string;
  class?: string;
  style?: CSSProperties;
}>();
</script>

<template>
  <span :class="cn(styles.monogramCircle, props.class)" :style="props.style" :aria-label="name">
    <img v-if="imageUrl" :src="imageUrl" alt="" :class="styles.monogramImage" />
    <span v-else :class="styles.monogramInitials">{{ getInitials(name) }}</span>
  </span>
</template>
