<script setup lang="ts">
import styles from '@larose-ui/styles/components/Toolbar/Toolbar.module.css';
import { useToolbarPlatform } from '../../composables/useToolbarPlatform';
import { BackChevronIcon } from './icons';
defineProps<{ disabled?: boolean; companionLabel?: string }>();
const emit = defineEmits<{ click: [] }>();
const platform = useToolbarPlatform();
</script>
<template>
  <button type="button" :class="styles.item" :data-platform="platform" aria-label="Back" :disabled="disabled" @click="emit('click')">
    <span :class="styles.itemIcon"><BackChevronIcon /></span>
    <span v-if="platform === 'visionos' && companionLabel" :class="styles.companion">{{ companionLabel }}</span>
  </button>
</template>
