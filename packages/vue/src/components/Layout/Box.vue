<script setup lang="ts">
import type { CSSProperties } from 'vue';
import styles from '@larose-ui/styles/components/Layout/Layout.module.css';
import { cn } from '../../utils/cn';
import { formatBoxTitle } from '../../Layout/utils';
import type { BoxTitlePosition, BoxVariant } from '../../Layout/types';

const props = withDefaults(
  defineProps<{
    title?: string;
    settingsStyle?: boolean;
    titlePosition?: BoxTitlePosition;
    variant?: BoxVariant;
    padding?: 'sm' | 'md' | 'lg';
    class?: string;
    style?: CSSProperties;
    ariaLabel?: string;
  }>(),
  { settingsStyle: false, titlePosition: 'inside', variant: 'secondary', padding: 'md' },
);

const formattedTitle = props.title ? formatBoxTitle(props.title, props.settingsStyle) : undefined;
</script>

<template>
  <section :class="cn(styles.boxWrapper, props.class)" :style="props.style" :aria-label="ariaLabel ?? formattedTitle">
    <h3 v-if="formattedTitle && titlePosition === 'above'" :class="styles.titleAbove">{{ formattedTitle }}</h3>
    <div :class="styles.box" :data-variant="variant" :data-padding="padding">
      <h3 v-if="formattedTitle && titlePosition === 'inside'" :class="styles.titleInside">{{ formattedTitle }}</h3>
      <div :class="styles.content"><slot /></div>
    </div>
  </section>
</template>
