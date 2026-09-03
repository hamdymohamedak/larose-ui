<script setup lang="ts">
import { computed, ref } from 'vue';
import { LIQUID_GLASS_PRESETS } from '../engine/defaults';
import type { LiquidGlassChromeProps, LiquidGlassGeometry, LiquidGlassOptics } from '../engine/types';
import LiquidGlass from '../core/LiquidGlass.vue';

const props = withDefaults(
  defineProps<
    LiquidGlassOptics & LiquidGlassGeometry & LiquidGlassChromeProps & {
      value?: number; defaultValue?: number; min?: number; max?: number; step?: number;
      disabled?: boolean; width?: number | string; trackHeight?: number; thumbSize?: number;
      fillColor?: string; ariaLabel?: string;
    }
  >(),
  {
    defaultValue: 50, min: 0, max: 100, step: 1, width: '100%', trackHeight: 8, thumbSize: 28,
    fillColor: 'rgba(255, 255, 255, 0.35)',
    displacementScale: LIQUID_GLASS_PRESETS.slider.displacementScale,
    bezelWidth: LIQUID_GLASS_PRESETS.slider.bezelWidth,
    borderRadius: LIQUID_GLASS_PRESETS.slider.borderRadius,
    shadowIntensity: LIQUID_GLASS_PRESETS.slider.shadowIntensity,
  },
);
const emit = defineEmits<{ change: [value: number] }>();
const radius = computed(() => props.borderRadius);
const internal = ref(props.defaultValue);
const current = computed(() => props.value ?? internal.value);
const pct = computed(() => props.max === props.min ? 0 : ((Math.min(props.max, Math.max(props.min, current.value)) - props.min) / (props.max - props.min)) * 100);
function onInput(event: Event) {
  const next = Number((event.target as HTMLInputElement).value);
  if (props.value === undefined) internal.value = next;
  emit('change', next);
}
</script>
<template>
  <div :class="className" :style="{ position: 'relative', width, height: `${thumbSize}px`, display: 'flex', alignItems: 'center', opacity: disabled ? 0.5 : 1, ...style }">
    <LiquidGlass width="100%" :height="trackHeight" :border-radius="radius" :displacement-scale="displacementScale" :bezel-width="bezelWidth" :shadow-intensity="shadowIntensity">
      <div :style="{ position: 'absolute', inset: 0, width: `${pct}%`, background: fillColor, borderRadius: 'inherit' }" />
    </LiquidGlass>
    <LiquidGlass :width="thumbSize" :height="thumbSize" :border-radius="999" :displacement-scale="displacementScale + 6" :bezel-width="Math.max(8, bezelWidth - 2)" :style="{ position: 'absolute', left: `calc(${pct}% - ${thumbSize / 2}px)`, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }" />
    <input type="range" :min="min" :max="max" :step="step" :value="current" :disabled="disabled" :aria-label="ariaLabel" :style="{ position: 'absolute', inset: 0, width: '100%', height: '100%', margin: 0, opacity: 0 }" @input="onInput" />
  </div>
</template>
