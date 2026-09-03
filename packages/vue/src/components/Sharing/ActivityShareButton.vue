<script setup lang="ts">
import { computed, ref } from 'vue';
import type { ActivityItem } from '../../Sharing/types';
import styles from '@larose-ui/styles/components/Sharing/Sharing.module.css';
import { cn } from '../../utils/cn';
import ShareButton from './ShareButton.vue';
import ActivityView from './ActivityView.vue';

const props = withDefaults(defineProps<{
  activities: ActivityItem[]; excludedActivityIds?: string[]; label?: string; title?: string;
  presentation?: 'sheet' | 'popover' | 'auto'; class?: string; style?: Record<string, string | number>;
}>(), { label: 'Share', presentation: 'auto' });

const emit = defineEmits<{ activitySelect: [ActivityItem] }>();
const open = ref(false);
const resolved = computed(() =>
  props.presentation === 'auto'
    ? (typeof window !== 'undefined' && window.matchMedia('(min-width: 640px)').matches ? 'popover' : 'sheet')
    : props.presentation,
);
</script>

<template>
  <span :class="cn(styles.wrapper, props.class)" :style="props.style">
    <ShareButton :label="label" :aria-expanded="open" @click="open = true" />
    <ActivityView :open="open" :activities="activities" :excluded-activity-ids="excludedActivityIds" :presentation="resolved" :title="title" @close="open = false" @activity-select="emit('activitySelect', $event)" />
  </span>
</template>
