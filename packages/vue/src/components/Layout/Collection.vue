<script setup lang="ts">
import type { CSSProperties } from 'vue';
import styles from '@larose-ui/styles/components/Layout/Layout.module.css';
import { cn } from '../../utils/cn';
import type { CollectionItem, CollectionLayout } from '../../Layout/types';

const props = withDefaults(
  defineProps<{
    items: CollectionItem[];
    layout?: CollectionLayout;
    class?: string;
    style?: CSSProperties;
    ariaLabel?: string;
  }>(),
  { layout: 'grid', ariaLabel: 'Collection' },
);
</script>

<template>
  <div
    :class="cn(styles.collection, props.class)"
    :style="props.style"
    :data-layout="layout"
    role="list"
    :aria-label="ariaLabel"
  >
    <div v-for="item in items" :key="item.id" :class="styles.item" role="listitem">
      <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.label ?? ''" :class="styles.itemImage" />
      <span v-if="item.label" :class="styles.itemLabel">{{ item.label }}</span>
      <slot name="item" :item="item" />
    </div>
  </div>
</template>
