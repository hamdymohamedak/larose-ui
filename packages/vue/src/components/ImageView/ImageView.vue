<script setup lang="ts">
import { onUnmounted, ref, watch, type CSSProperties } from 'vue';
import styles from '@larose-ui/styles/components/ImageView/ImageView.module.css';
import { cn } from '../../utils/cn';
import type { ImageBackground, ImageFit, ImageFrameSequence } from '../../ImageView/types';
import { nextFrameIndex, sequenceInterval } from '../../ImageView/utils';

const props = withDefaults(
  defineProps<{
    src?: string;
    alt: string;
    fit?: ImageFit;
    objectPosition?: string;
    background?: ImageBackground;
    sequence?: ImageFrameSequence;
    class?: string;
    style?: CSSProperties;
    frameClass?: string;
    frameStyle?: CSSProperties;
  }>(),
  { fit: 'contain', objectPosition: 'center', background: 'opaque' },
);

const frameIndex = ref(0);
let timer: number | undefined;

watch(
  () => props.sequence,
  (sequence) => {
    if (timer) window.clearInterval(timer);
    frameIndex.value = 0;
    if (!sequence?.frames.length) return;
    timer = window.setInterval(() => {
      frameIndex.value = nextFrameIndex(frameIndex.value, sequence.frames.length);
    }, sequenceInterval(sequence));
  },
  { immediate: true },
);

onUnmounted(() => {
  if (timer) window.clearInterval(timer);
});

const activeSrc = () =>
  props.sequence?.frames.length ? props.sequence.frames[frameIndex.value] : props.src;
</script>

<template>
  <div
    v-if="activeSrc()"
    :class="cn(styles.frame, frameClass)"
    :style="frameStyle"
    :data-background="background"
  >
    <img
      :src="activeSrc()"
      :alt="alt"
      :class="cn(styles.image, props.class)"
      :style="{ objectFit: fit, objectPosition, ...(($props.style as object) ?? {}) }"
    />
  </div>
</template>
