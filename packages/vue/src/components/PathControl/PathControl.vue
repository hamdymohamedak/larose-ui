<script setup lang="ts">
import { computed, type CSSProperties } from 'vue';
import styles from '@larose-ui/styles/components/PathControl/PathControl.module.css';
import { cn } from '../../utils/cn';
import {
  collapsePathSegments,
  isEllipsisSegment,
  resolveSelectedSegment,
} from '../../PathControl/utils';
import type { PathControlVariant, PathSegment } from '../../PathControl/types';

const props = withDefaults(
  defineProps<{
    segments: PathSegment[];
    modelValue?: string;
    variant?: PathControlVariant;
    class?: string;
    style?: CSSProperties;
  }>(),
  { variant: 'standard' },
);

const emit = defineEmits<{ 'update:modelValue': [id: string]; select: [segment: PathSegment] }>();
const visible = computed(() => collapsePathSegments(props.segments));
const selected = computed(() => resolveSelectedSegment(props.segments, props.modelValue));

function onSelect(segment: PathSegment) {
  emit('update:modelValue', segment.id);
  emit('select', segment);
}
</script>

<template>
  <nav
    :class="cn(styles.pathControl, variant === 'standard' ? styles.standard : undefined, props.class)"
    :style="props.style"
    :data-variant="variant"
    aria-label="Path"
  >
    <template v-for="(segment, index) in visible" :key="segment.id">
      <span v-if="isEllipsisSegment(segment)" :class="styles.ellipsis">…</span>
      <button
        v-else
        type="button"
        :class="styles.segment"
        :data-selected="selected?.id === segment.id ? 'true' : undefined"
        @click="onSelect(segment)"
      >
        {{ segment.label }}
      </button>
      <span v-if="index < visible.length - 1" :class="styles.separator" aria-hidden="true">/</span>
    </template>
  </nav>
</template>
