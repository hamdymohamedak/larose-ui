<script setup lang="ts">
import { computed } from 'vue';
import type { FilePreviewSource } from '../../FileManagement/types';
import { canPreviewFile } from '../../FileManagement/utils';
import styles from '@larose-ui/styles/components/FileManagement/FileManagement.module.css';
import { cn } from '../../utils/cn';
import Button from '../Button/Button.vue';
import { PreviewIcon } from './icons';

const props = withDefaults(defineProps<{ source: FilePreviewSource; closeLabel?: string; class?: string; style?: Record<string, string | number> }>(), { closeLabel: 'Close preview' });
const emit = defineEmits<{ close: [] }>();
const previewable = computed(() => canPreviewFile(props.source));
const type = computed(() => (props.source.type ?? props.source.extension ?? '').toLowerCase());
const isImage = computed(() => type.value.includes('image') || ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(type.value));
</script>

<template>
  <section :class="cn(styles.preview, props.class)" :style="props.style" :aria-label="`Preview ${source.name}`">
    <div :class="styles.previewHeader">
      <h3 :class="styles.previewTitle">{{ source.name }}</h3>
      <Button size="sm" variant="secondary" @click="emit('close')">{{ closeLabel }}</Button>
    </div>
    <div :class="styles.previewBody">
      <div v-if="!previewable" :class="styles.previewFallback"><PreviewIcon /><span>Preview isn’t available for this file type.</span></div>
      <pre v-if="previewable && source.textContent" :class="styles.previewText">{{ source.textContent }}</pre>
      <img v-if="previewable && source.url && isImage" :class="styles.previewImage" :src="source.url" :alt="source.name" />
      <iframe v-if="previewable && source.url && !isImage && !source.textContent" :title="source.name" :src="source.url" style="width:100%;min-height:18rem;border:0;border-radius:0.5rem" />
    </div>
  </section>
</template>
