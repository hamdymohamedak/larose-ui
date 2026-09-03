<script setup lang="ts">
import { computed, provide, ref, toRef, watchEffect } from 'vue';
import type { ToolbarPlatform, ToolbarPlacement } from '../../Toolbar/types';
import { resolveToolbarPlacement, warnIfToolbarTitleTooLong } from '../../Toolbar/utils';
import styles from '@larose-ui/styles/components/Toolbar/Toolbar.module.css';
import { cn } from '../../utils/cn';
import { toolbarPlatformKey } from '../../composables/useToolbarPlatform';
import ToolbarSection from './ToolbarSection.vue';
import ToolbarTitle from './ToolbarTitle.vue';

const props = withDefaults(defineProps<{
  title?: string; platform?: ToolbarPlatform; largeTitle?: boolean; placement?: ToolbarPlacement;
  hidden?: boolean; class?: string; style?: Record<string, string | number>; 'aria-label'?: string;
}>(), { platform: 'macos', largeTitle: false, hidden: false });

provide(toolbarPlatformKey, toRef(props, 'platform'));
const resolvedPlacement = computed(() => resolveToolbarPlacement(props.platform, props.placement));
watchEffect(() => { if (props.title) warnIfToolbarTitleTooLong(props.title); });
</script>
<template>
  <div
    role="toolbar"
    :aria-label="props['aria-label'] ?? (title ? `${title} toolbar` : 'Toolbar')"
    :class="cn(styles.toolbar, props.class)"
    :style="props.style"
    :data-platform="platform"
    :data-placement="resolvedPlacement"
    :data-large-title="largeTitle ? 'true' : undefined"
    :data-hidden="hidden ? 'true' : undefined"
  >
    <ToolbarSection v-if="title && !$slots.default" placement="leading">
      <ToolbarTitle :title="title" :large="largeTitle" />
    </ToolbarSection>
    <slot />
  </div>
</template>
