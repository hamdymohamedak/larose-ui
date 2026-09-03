<script setup lang="ts">
import styles from '@larose-ui/styles/components/Toolbar/Toolbar.module.css';
import { useToolbarPlatform } from '../../composables/useToolbarPlatform';
import { CloseIcon } from './icons';
defineProps<{ disabled?: boolean }>();
const emit = defineEmits<{ click: [] }>();
const platform = useToolbarPlatform();
</script>
<template>
  <button type="button" :class="styles.item" :data-platform="platform" aria-label="Close" :disabled="disabled" @click="emit('click')">
    <span :class="styles.itemIcon"><CloseIcon /></span>
  </button>
</template>
