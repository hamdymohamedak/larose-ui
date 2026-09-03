<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import LiquidGlassTabBar from '../../../packages/vue/src/LiquidGlass/TabBar/LiquidGlassTabBar.vue';
import type { LiquidGlassTabItem } from '../../../packages/vue/src/LiquidGlass/engine/types';
import GlassScrollScene from './GlassScrollScene.vue';

type TabPreset = 'full' | 'iconsOnly' | 'badges' | 'threeTabs';

const props = withDefaults(
  defineProps<{
    tabPreset?: TabPreset;
    defaultActiveKey?: string;
    height?: number;
    borderRadius?: number;
    maxWidth?: number;
    indicatorPadding?: number;
    showIndicator?: boolean;
    indicatorBackground?: string;
    indicatorBorderColor?: string;
    activeColor?: string;
    inactiveColor?: string;
    position?: 'fixed' | 'absolute' | 'relative' | 'static';
    bottom?: number | string;
    blur?: number;
    saturation?: number;
    tint?: string;
    tintFallback?: string;
    displacementScale?: number;
    bezelWidth?: number;
    refractionStrength?: number;
    showSpecular?: boolean;
    specularAngle?: number;
    specularTopOpacity?: number;
    specularEdgeOpacity?: number;
    innerTopHighlight?: number;
    innerBottomShadow?: number;
    shadowIntensity?: number;
    borderColor?: string;
  }>(),
  {
    tabPreset: 'full',
    defaultActiveKey: 'home',
    height: 64,
    maxWidth: 420,
    indicatorPadding: 8,
    showIndicator: true,
    position: 'fixed',
    bottom: 22,
  },
);

const PRESETS: Record<TabPreset, LiquidGlassTabItem[]> = {
  full: [
    { key: 'home', label: 'Home', ariaLabel: 'Home' },
    { key: 'search', label: 'Search', ariaLabel: 'Search' },
    { key: 'create', ariaLabel: 'Create' },
    { key: 'library', label: 'Library', ariaLabel: 'Library' },
    { key: 'profile', label: 'Profile', ariaLabel: 'Profile' },
  ],
  iconsOnly: [
    { key: 'home', ariaLabel: 'Home' },
    { key: 'search', ariaLabel: 'Search' },
    { key: 'create', ariaLabel: 'Create' },
    { key: 'library', ariaLabel: 'Library' },
    { key: 'profile', ariaLabel: 'Profile' },
  ],
  badges: [
    { key: 'home', label: 'Home' },
    { key: 'search', label: 'Search' },
    { key: 'notifs', label: 'Alerts', badge: 12 },
    { key: 'library', label: 'Library', badge: '•' },
    { key: 'settings', label: 'Settings' },
  ],
  threeTabs: [
    { key: 'home', label: 'Home' },
    { key: 'search', label: 'Search' },
    { key: 'create', ariaLabel: 'Create' },
  ],
};

const items = computed(() => PRESETS[props.tabPreset] ?? PRESETS.full);
const active = ref(props.defaultActiveKey ?? items.value[0]?.key ?? 'home');

watch(
  () => [props.tabPreset, props.defaultActiveKey] as const,
  () => {
    const keys = items.value.map((item) => item.key);
    if (props.defaultActiveKey && keys.includes(props.defaultActiveKey)) {
      active.value = props.defaultActiveKey;
    } else if (!keys.includes(active.value)) {
      active.value = keys[0] ?? 'home';
    }
  },
  { immediate: true },
);

const tabBarProps = computed(() => {
  const {
    tabPreset: _tabPreset,
    defaultActiveKey: _defaultActiveKey,
    ...rest
  } = props;
  return rest;
});
</script>

<template>
  <GlassScrollScene>
    <LiquidGlassTabBar
      v-bind="tabBarProps"
      :items="items"
      :active-key="active"
      @change="active = $event"
    >
      <template #icon="{ item }">
        <svg
          v-if="item.key === 'home'"
          viewBox="0 0 24 24"
          width="23"
          height="23"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M4 11.5 12 4l8 7.5" />
          <path d="M6 10v9h5v-5h2v5h5v-9" />
        </svg>
        <svg
          v-else-if="item.key === 'search'"
          viewBox="0 0 24 24"
          width="23"
          height="23"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="m20 20-4.6-4.6" />
        </svg>
        <svg
          v-else-if="item.key === 'create'"
          viewBox="0 0 24 24"
          width="23"
          height="23"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 8.2v7.6M8.2 12h7.6" />
        </svg>
        <svg
          v-else-if="item.key === 'library'"
          viewBox="0 0 24 24"
          width="23"
          height="23"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M6 4h9a2 2 0 0 1 2 2v14l-6.5-3.4L4 20V6a2 2 0 0 1 2-2Z" />
        </svg>
        <svg
          v-else-if="item.key === 'profile'"
          viewBox="0 0 24 24"
          width="23"
          height="23"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="8.5" r="3.5" />
          <path d="M4.8 20c1.2-3.6 4.1-5.5 7.2-5.5s6 1.9 7.2 5.5" />
        </svg>
        <svg
          v-else-if="item.key === 'notifs'"
          viewBox="0 0 24 24"
          width="23"
          height="23"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        <svg
          v-else-if="item.key === 'settings'"
          viewBox="0 0 24 24"
          width="23"
          height="23"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="3" />
          <path
            d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"
          />
        </svg>
      </template>
    </LiquidGlassTabBar>
  </GlassScrollScene>
</template>
