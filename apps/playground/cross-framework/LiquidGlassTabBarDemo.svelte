<script lang="ts">
  import LiquidGlassTabBar from '../../../packages/svelte/src/lib/LiquidGlass/TabBar/LiquidGlassTabBar.svelte';
  import type { LiquidGlassTabItem } from '../../../packages/svelte/src/lib/LiquidGlass/engine/types';
  import GlassScrollScene from './GlassScrollScene.svelte';

  type TabPreset = 'full' | 'iconsOnly' | 'badges' | 'threeTabs';

  let {
    tabPreset = 'full',
    defaultActiveKey = 'home',
    height = 64,
    borderRadius,
    maxWidth = 420,
    indicatorPadding = 8,
    showIndicator = true,
    indicatorBackground,
    indicatorBorderColor,
    activeColor,
    inactiveColor,
    position = 'fixed',
    bottom = 22,
    blur,
    saturation,
    tint,
    tintFallback,
    displacementScale,
    bezelWidth,
    refractionStrength,
    showSpecular,
    specularAngle,
    specularTopOpacity,
    specularEdgeOpacity,
    innerTopHighlight,
    innerBottomShadow,
    shadowIntensity,
    borderColor,
  }: {
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
  } = $props();

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

  const items = $derived(PRESETS[tabPreset] ?? PRESETS.full);
  let active = $state('home');

  $effect(() => {
    const keys = items.map((item) => item.key);
    const preferred = defaultActiveKey;
    if (preferred && keys.includes(preferred)) {
      active = preferred;
    } else if (!keys.includes(active)) {
      active = keys[0] ?? 'home';
    }
  });
</script>

{#snippet tabIcon(item: LiquidGlassTabItem, _active: boolean)}
  {#if item.key === 'home'}
    <svg viewBox="0 0 24 24" width="23" height="23" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 11.5 12 4l8 7.5" /><path d="M6 10v9h5v-5h2v5h5v-9" />
    </svg>
  {:else if item.key === 'search'}
    <svg viewBox="0 0 24 24" width="23" height="23" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="10.5" cy="10.5" r="6.5" /><path d="m20 20-4.6-4.6" />
    </svg>
  {:else if item.key === 'create'}
    <svg viewBox="0 0 24 24" width="23" height="23" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="8.5" /><path d="M12 8.2v7.6M8.2 12h7.6" />
    </svg>
  {:else if item.key === 'library'}
    <svg viewBox="0 0 24 24" width="23" height="23" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 4h9a2 2 0 0 1 2 2v14l-6.5-3.4L4 20V6a2 2 0 0 1 2-2Z" />
    </svg>
  {:else if item.key === 'profile'}
    <svg viewBox="0 0 24 24" width="23" height="23" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="8.5" r="3.5" /><path d="M4.8 20c1.2-3.6 4.1-5.5 7.2-5.5s6 1.9 7.2 5.5" />
    </svg>
  {:else if item.key === 'notifs'}
    <svg viewBox="0 0 24 24" width="23" height="23" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  {:else if item.key === 'settings'}
    <svg viewBox="0 0 24 24" width="23" height="23" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
    </svg>
  {/if}
{/snippet}

<GlassScrollScene>
  <LiquidGlassTabBar
    {items}
    activeKey={active}
    onChange={(key) => (active = key)}
    {height}
    {borderRadius}
    {maxWidth}
    {indicatorPadding}
    {showIndicator}
    {indicatorBackground}
    {indicatorBorderColor}
    {activeColor}
    {inactiveColor}
    {position}
    {bottom}
    {blur}
    {saturation}
    {tint}
    {tintFallback}
    {displacementScale}
    {bezelWidth}
    {refractionStrength}
    {showSpecular}
    {specularAngle}
    {specularTopOpacity}
    {specularEdgeOpacity}
    {innerTopHighlight}
    {innerBottomShadow}
    {shadowIntensity}
    {borderColor}
    icon={tabIcon}
  />
</GlassScrollScene>
