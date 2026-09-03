<script lang="ts">
  import type { Snippet } from 'svelte';
  import { LIQUID_GLASS_PRESETS } from '../engine/defaults';
  import type { LiquidGlassChromeProps, LiquidGlassOptics, LiquidGlassTopBarItem } from '../engine/types';
  import LiquidGlass from '../core/LiquidGlass.svelte';

  let {
    title, items = [], activeKey, defaultActiveKey, onChange, variant = 'floating', height = 56,
    className, style, logo, trailing,
    displacementScale = LIQUID_GLASS_PRESETS.topBar.displacementScale,
    bezelWidth = LIQUID_GLASS_PRESETS.topBar.bezelWidth,
    specularAngle = LIQUID_GLASS_PRESETS.topBar.specularAngle, ...optics
  }: LiquidGlassOptics & LiquidGlassChromeProps & {
    title?: string; items?: LiquidGlassTopBarItem[]; activeKey?: string; defaultActiveKey?: string;
    onChange?: (key: string) => void; variant?: 'floating' | 'edge'; height?: number;
    logo?: Snippet; trailing?: Snippet;
  } = $props();

  const borderRadius = variant === 'floating' ? LIQUID_GLASS_PRESETS.topBar.borderRadius : 0;
  let internal = $state(defaultActiveKey ?? items[0]?.key ?? '');
  const current = $derived(activeKey ?? internal);
  function select(key: string, disabled?: boolean) {
    if (disabled) return;
    if (activeKey === undefined) internal = key;
    onChange?.(key);
  }
</script>

<LiquidGlass as="header" aria-label="Top navigation" {className} width="100%" {height} {borderRadius} {displacementScale} {bezelWidth} {specularAngle} {...optics} {style}>
  <div style="display:flex;align-items:center;gap:10px">
    {@render logo?.()}
    {#if title}<strong>{title}</strong>{/if}
  </div>
  {#if items.length}
    <div role="tablist">
      {#each items as item (item.key)}
        <button type="button" role="tab" aria-selected={item.key === current} disabled={item.disabled} onclick={() => select(item.key, item.disabled)}>{item.label}</button>
      {/each}
    </div>
  {/if}
  {@render trailing?.()}
</LiquidGlass>
