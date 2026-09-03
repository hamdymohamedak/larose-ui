<script lang="ts">
  import type { Snippet } from 'svelte';
  import { LIQUID_GLASS_PRESETS } from '../engine/defaults';
  import type { LiquidGlassChromeProps, LiquidGlassOptics, LiquidGlassTabItem } from '../engine/types';
  import LiquidGlass from '../core/LiquidGlass.svelte';

  let {
    items, activeKey, defaultActiveKey, onChange, height = 64, className, style, icon,
    borderRadius = LIQUID_GLASS_PRESETS.tabBar.borderRadius, maxWidth = 420,
    displacementScale = LIQUID_GLASS_PRESETS.tabBar.displacementScale,
    bezelWidth = LIQUID_GLASS_PRESETS.tabBar.bezelWidth, ...optics
  }: LiquidGlassOptics & LiquidGlassChromeProps & {
    items: LiquidGlassTabItem[]; activeKey?: string; defaultActiveKey?: string;
    onChange?: (key: string) => void; height?: number; borderRadius?: number; maxWidth?: number;
    icon?: Snippet<[LiquidGlassTabItem, boolean]>;
  } = $props();

  let internal = $state(defaultActiveKey ?? items[0]?.key ?? '');
  const current = $derived(activeKey ?? internal);
  function select(key: string, disabled?: boolean) {
    if (disabled) return;
    if (activeKey === undefined) internal = key;
    onChange?.(key);
  }
</script>

<LiquidGlass as="nav" aria-label="Primary navigation" {className} width="100%" {maxWidth} {height} {borderRadius} {displacementScale} {bezelWidth} {...optics} {style}>
  <div role="tablist" style="display:flex;width:100%;height:100%">
    {#each items as item (item.key)}
      <button type="button" role="tab" aria-selected={item.key === current} disabled={item.disabled} style="flex:1;background:none;border:none" onclick={() => select(item.key, item.disabled)}>
        {@render icon?.(item, item.key === current)}
        {#if item.label}{item.label}{/if}
      </button>
    {/each}
  </div>
</LiquidGlass>
