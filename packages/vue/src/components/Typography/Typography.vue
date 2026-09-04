<script setup lang="ts">
import { computed } from 'vue';
import type { CSSProperties } from 'vue';
import type { TypographyRole } from '@larose-ui/core';
import styles from '@larose-ui/styles/components/Typography/Typography.module.css';
import { cn } from '../../utils/cn';

const defaultElement: Record<TypographyRole, string> = {
  display: 'h1',
  largeTitle: 'h1',
  title: 'h2',
  headline: 'h3',
  body: 'p',
  callout: 'p',
  subheadline: 'p',
  footnote: 'small',
  caption: 'span',
};

const props = withDefaults(
  defineProps<{
    role?: TypographyRole;
    as?: string;
    class?: string;
    style?: CSSProperties;
    muted?: boolean;
  }>(),
  {
    role: 'body',
    muted: false,
  },
);

const tag = computed(() => props.as ?? defaultElement[props.role]);
</script>

<template>
  <component
    :is="tag"
    :class="cn(styles.root, $props.class)"
    :style="style"
    :data-lr-type="role"
    :data-muted="muted ? 'true' : undefined"
  >
    <slot />
  </component>
</template>
