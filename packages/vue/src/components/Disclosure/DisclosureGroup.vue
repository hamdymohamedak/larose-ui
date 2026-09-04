<script setup lang="ts">
import type { CSSProperties } from 'vue';
import styles from '@larose-ui/styles/components/Disclosure/Disclosure.module.css';
import { cn } from '../../utils/cn';

defineProps<{ class?: string; style?: CSSProperties }>();
</script>

<template>
  <div :class="cn(styles.group, $props.class)" :style="$props.style">
    <slot />
  </div>
</template>
