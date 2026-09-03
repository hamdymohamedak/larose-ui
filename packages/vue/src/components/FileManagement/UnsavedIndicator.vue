<script setup lang="ts">
import { documentTitleWithEditedSuffix } from '../../FileManagement/utils';
import styles from '@larose-ui/styles/components/FileManagement/FileManagement.module.css';
import { cn } from '../../utils/cn';
const props = withDefaults(defineProps<{ title: string; edited?: boolean; autosaveEnabled?: boolean; class?: string; style?: Record<string, string | number> }>(), { edited: false, autosaveEnabled: true });
</script>
<template>
  <span :class="cn(styles.unsaved, props.class)" :style="props.style">
    <span :class="styles.unsavedDot" :data-hidden="edited && !autosaveEnabled ? 'false' : 'true'" :aria-hidden="!(edited && !autosaveEnabled)" title="Unsaved changes" />
    <span>{{ documentTitleWithEditedSuffix(title, edited, autosaveEnabled) }}</span>
  </span>
</template>
