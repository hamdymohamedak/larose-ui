<script setup lang="ts">
import { computed, provide, ref } from 'vue';
import styles from '@larose-ui/styles/components/Sidebar/Sidebar.module.css';
import { cn } from '../../utils/cn';

export type SidebarPlatform = 'ios' | 'ipados' | 'macos' | 'visionos';
export type SidebarSize = 'small' | 'medium' | 'large';

const props = withDefaults(defineProps<{
  platform?: SidebarPlatform; size?: SidebarSize; hidden?: boolean; glass?: boolean;
  height?: string; maxHeight?: string; 'aria-label'?: string; class?: string; style?: Record<string, string | number>;
}>(), { platform: 'macos', size: 'medium', hidden: false, glass: true, 'aria-label': 'Sidebar' });

const sidebarStyle = computed(() => ({
  ...props.style,
  ...(props.height ? { '--lr-sidebar-height': props.height } : {}),
  ...(props.maxHeight ? { '--lr-sidebar-max-height': props.maxHeight } : {}),
}));
</script>
<template>
  <aside
    v-if="!hidden"
    :class="cn(styles.sidebar, props.class)"
    :aria-label="props['aria-label']"
    :data-platform="platform"
    :data-size="size"
    :data-glass="glass ? 'true' : undefined"
    :style="sidebarStyle"
  >
    <slot />
  </aside>
</template>
