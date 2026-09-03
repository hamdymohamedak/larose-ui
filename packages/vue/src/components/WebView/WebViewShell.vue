<script setup lang="ts">
import type { CSSProperties } from 'vue';
import styles from '@larose-ui/styles/components/WebView/WebView.module.css';
import { cn } from '../../utils/cn';
import WebView from './WebView.vue';
import WebViewNavigation from './WebViewNavigation.vue';

defineProps<{
  src: string;
  title?: string;
  canGoBack?: boolean;
  canGoForward?: boolean;
  class?: string;
  style?: CSSProperties;
}>();
const emit = defineEmits<{ back: []; forward: []; reload: [] }>();
</script>

<template>
  <div :class="cn(styles.shell, $props.class)" :style="$props.style">
    <WebViewNavigation
      :title="title"
      :can-go-back="canGoBack"
      :can-go-forward="canGoForward"
      @back="emit('back')"
      @forward="emit('forward')"
      @reload="emit('reload')"
    >
      <slot name="toolbar" />
    </WebViewNavigation>
    <div :class="styles.frame">
      <WebView :src="src" :title="title" />
    </div>
  </div>
</template>
