<script setup lang="ts">
import type { CSSProperties } from 'vue';
import styles from '@larose-ui/styles/components/WebView/WebView.module.css';
import { cn } from '../../utils/cn';

defineProps<{
  canGoBack?: boolean;
  canGoForward?: boolean;
  title?: string;
  class?: string;
  style?: CSSProperties;
}>();
const emit = defineEmits<{ back: []; forward: []; reload: [] }>();
</script>

<template>
  <div :class="cn(styles.toolbar, $props.class)" :style="$props.style" role="toolbar" aria-label="Web navigation">
    <button type="button" :class="styles.navButton" :disabled="!canGoBack" aria-label="Back" @click="emit('back')">‹</button>
    <button type="button" :class="styles.navButton" :disabled="!canGoForward" aria-label="Forward" @click="emit('forward')">›</button>
    <button type="button" :class="styles.navButton" aria-label="Reload" @click="emit('reload')">↻</button>
    <span v-if="title" :class="styles.toolbarTitle">{{ title }}</span>
    <slot />
  </div>
</template>
