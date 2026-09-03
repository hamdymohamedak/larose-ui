<script setup lang="ts">
import type { CSSProperties } from 'vue';
import { sanitizeNavigationUrl } from '@larose-ui/core';
import styles from '@larose-ui/styles/components/Breadcrumb/Breadcrumb.module.css';
import { cn } from '../../utils/cn';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
  current?: boolean;
}

const props = withDefaults(
  defineProps<{
    items: BreadcrumbItem[];
    class?: string;
    style?: CSSProperties;
    ariaLabel?: string;
  }>(),
  { ariaLabel: 'Breadcrumb' },
);
</script>

<template>
  <nav :class="cn(styles.nav, props.class)" :style="props.style" :aria-label="ariaLabel">
    <ol :class="styles.list">
      <li v-for="(item, index) in items" :key="`${item.label}-${index}`" :class="styles.item">
        <span v-if="item.current ?? index === items.length - 1" :class="styles.current" aria-current="page">
          {{ item.label }}
        </span>
        <a
          v-else-if="sanitizeNavigationUrl(item.href)"
          :href="sanitizeNavigationUrl(item.href)!"
          :class="styles.link"
          @click="item.onClick?.()"
        >
          {{ item.label }}
        </a>
        <button
          v-else-if="item.onClick"
          type="button"
          :class="styles.linkButton"
          @click="item.onClick"
        >
          {{ item.label }}
        </button>
        <span v-else :class="styles.current">{{ item.label }}</span>
        <span v-if="index < items.length - 1" :class="styles.separator" aria-hidden="true">/</span>
      </li>
    </ol>
  </nav>
</template>
