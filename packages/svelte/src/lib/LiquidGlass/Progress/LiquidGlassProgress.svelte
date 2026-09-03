<script lang="ts">
  import { LIQUID_GLASS_PRESETS } from '../engine/defaults';
  import type { LiquidGlassChromeProps, LiquidGlassGeometry, LiquidGlassOptics } from '../engine/types';
  import LiquidGlass from '../core/LiquidGlass.svelte';

  let {
    value = 0, max = 100, indeterminate = false, width = '100%', height = 10, className, ariaLabel,
    borderRadius = LIQUID_GLASS_PRESETS.progress.borderRadius,
    fillColor = 'rgba(255,255,255,0.55)',
    displacementScale = LIQUID_GLASS_PRESETS.progress.displacementScale,
    bezelWidth = LIQUID_GLASS_PRESETS.progress.bezelWidth,
    shadowIntensity = LIQUID_GLASS_PRESETS.progress.shadowIntensity, ...optics
  }: LiquidGlassOptics & LiquidGlassGeometry & LiquidGlassChromeProps & {
    value?: number; max?: number; indeterminate?: boolean; width?: number | string; height?: number;
    fillColor?: string; ariaLabel?: string;
  } = $props();
  const pct = $derived(indeterminate ? 40 : Math.min(100, Math.max(0, (value / (max || 100)) * 100)));
</script>

<div class={className} role="progressbar" aria-label={ariaLabel} aria-valuenow={indeterminate ? undefined : value} style="position:relative;width:{width};height:{height}px">
  <LiquidGlass width="100%" height="100%" {borderRadius} {displacementScale} {bezelWidth} {shadowIntensity} {...optics} />
  <div style="position:absolute;inset:2px;width:{pct}%;background:{fillColor};border-radius:{borderRadius}px"></div>
</div>
