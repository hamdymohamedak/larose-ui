<script setup lang="ts">
import styles from '@larose-ui/styles/components/Sharing/Sharing.module.css';
import { cn } from '../../utils/cn';
import { ShareIcon } from './icons';
withDefaults(defineProps<{ label?: string; class?: string }>(), { label: 'Share' });
</script>
<template>
  <button type="button" :class="cn(styles.toolbarButton, $props.class)" :aria-label="label"><ShareIcon /></button>
</template>
