<script setup lang="ts">
import { LIQUID_GLASS_PRESETS } from '../engine/defaults';
import type { LiquidGlassChromeProps, LiquidGlassOptics } from '../engine/types';
import LiquidGlass from '../core/LiquidGlass.vue';

withDefaults(
  defineProps<
    LiquidGlassOptics & LiquidGlassChromeProps & {
      value?: number; max?: number; indeterminate?: boolean; width?: number | string;
      height?: number; borderRadius?: number; fillColor?: string; fillGlow?: string; ariaLabel?: string;
    }
  >(),
  {
    value: 0, max: 100, width: '100%', height: 10,
    borderRadius: LIQUID_GLASS_PRESETS.progress.borderRadius,
    fillColor: 'rgba(255, 255, 255, 0.55)', fillGlow: 'rgba(255, 255, 255, 0.35)',
    displacementScale: LIQUID_GLASS_PRESETS.progress.displacementScale,
    bezelWidth: LIQUID_GLASS_PRESETS.progress.bezelWidth,
    shadowIntensity: LIQUID_GLASS_PRESETS.progress.shadowIntensity,
  },
);
</script>
<template>
  <div :class="className" role="progressbar" :aria-label="ariaLabel" :aria-valuenow="indeterminate ? undefined : value" :style="{ position: 'relative', width, height: `${height}px`, ...style }">
    <LiquidGlass width="100%" height="100%" :border-radius="borderRadius" :displacement-scale="displacementScale" :bezel-width="bezelWidth" :shadow-intensity="shadowIntensity" :tint="tint" :tint-fallback="tintFallback" />
    <div :style="{ position: 'absolute', inset: 2, width: indeterminate ? '40%' : `${Math.min(100, Math.max(0, (value / (max || 100)) * 100))}%`, borderRadius: `${borderRadius}px`, background: `linear-gradient(90deg, ${fillColor}, ${fillGlow})` }" />
  </div>
</template>
