<script setup lang="ts">
import type { CSSProperties } from 'vue';
import styles from '@larose-ui/styles/components/WebView/WebView.module.css';
import { cn } from '../../utils/cn';

defineProps<{
  src: string;
  title?: string;
  class?: string;
  style?: CSSProperties;
  sandbox?: string;
}>();
</script>

<template>
  <iframe
    :src="src"
    :title="title ?? 'Web view'"
    :class="cn(styles.frameOnly, $props.class)"
    :style="$props.style"
    :sandbox="sandbox ?? 'allow-scripts allow-same-origin allow-forms'"
  />
</template>
