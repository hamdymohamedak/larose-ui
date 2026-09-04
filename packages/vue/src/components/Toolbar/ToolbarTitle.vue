<script setup lang="ts">
import { watchEffect } from 'vue';
import styles from '@larose-ui/styles/components/Toolbar/Toolbar.module.css';
import { cn } from '../../utils/cn';
import { truncateToolbarTitle, warnIfToolbarTitleTooLong } from '../../Toolbar/utils';
const props = withDefaults(defineProps<{ children?: string; large?: boolean; class?: string; style?: Record<string, string | number>; title?: string }>(), { large: false });
const text = () => props.title ?? props.children ?? '';
watchEffect(() => warnIfToolbarTitleTooLong(text()));
</script>
<template>
  <span :class="cn(styles.title, large ? styles.titleLarge : undefined, $props.class)" :style="$props.style" :title="text()">
    {{ truncateToolbarTitle(text(), large ? 40 : 15) }}
  </span>
</template>
