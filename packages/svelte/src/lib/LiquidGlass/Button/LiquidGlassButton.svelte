<script lang="ts">
  import type { Snippet } from 'svelte';
  import { LIQUID_GLASS_PRESETS } from '../engine/defaults';
  import type { LiquidGlassChromeProps, LiquidGlassGeometry, LiquidGlassOptics } from '../engine/types';
  import LiquidGlass from '../core/LiquidGlass.svelte';

  let {
    width = 140, height = 48, borderRadius = LIQUID_GLASS_PRESETS.button.borderRadius,
    color = '#ffffff', disabled = false, type = 'button', className, style, children,
    displacementScale = LIQUID_GLASS_PRESETS.button.displacementScale,
    bezelWidth = LIQUID_GLASS_PRESETS.button.bezelWidth,
    shadowIntensity = LIQUID_GLASS_PRESETS.button.shadowIntensity,
    ...optics
  }: LiquidGlassOptics & LiquidGlassGeometry & LiquidGlassChromeProps & {
    width?: number | string; height?: number | string; borderRadius?: number; color?: string;
    disabled?: boolean; type?: 'button' | 'submit' | 'reset'; children?: Snippet;
  } = $props();
</script>

<LiquidGlass as="button" {type} {disabled} {className} {width} {height} {borderRadius} {displacementScale} {bezelWidth} {shadowIntensity} {...optics} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, color, padding: '0 1.25rem', ...style }}>
  {@render children?.()}
</LiquidGlass>
