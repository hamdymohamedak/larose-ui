<script setup lang="ts">
import { computed, ref } from 'vue';
import { LIQUID_GLASS_PRESETS } from '../engine/defaults';
import type { LiquidGlassChromeProps, LiquidGlassGeometry, LiquidGlassOptics } from '../engine/types';
import LiquidGlass from '../core/LiquidGlass.vue';
import {
  LIQUID_GLASS_SWITCH_ACTIVE_GREEN,
  LIQUID_GLASS_SWITCH_TRACK_GLASS,
} from './constants';

const props = withDefaults(
  defineProps<
    LiquidGlassOptics &
      LiquidGlassGeometry &
      LiquidGlassChromeProps & {
        checked?: boolean;
        defaultChecked?: boolean;
        disabled?: boolean;
        width?: number;
        height?: number;
        thumbSize?: number;
        padding?: number;
        activeTrackTint?: string;
        inactiveTrackTint?: string;
        thumbTint?: string;
        ariaLabel?: string;
      }
  >(),
  {
    defaultChecked: false,
    width: 52,
    height: 32,
    thumbSize: 28,
    padding: 2,
    activeTrackTint: LIQUID_GLASS_SWITCH_ACTIVE_GREEN,
    displacementScale: LIQUID_GLASS_PRESETS.switch.displacementScale,
    bezelWidth: LIQUID_GLASS_PRESETS.switch.bezelWidth,
    borderRadius: LIQUID_GLASS_PRESETS.switch.borderRadius,
    shadowIntensity: LIQUID_GLASS_PRESETS.switch.shadowIntensity,
  },
);
const emit = defineEmits<{ change: [checked: boolean] }>();
const radius = computed(() => props.borderRadius);
const internalChecked = ref(props.defaultChecked);
const isOn = computed(() => props.checked ?? internalChecked.value);
const travel = computed(() => Math.max(0, props.width - props.thumbSize - props.padding * 2));
const trackTint = computed(() => {
  if (!isOn.value) return props.inactiveTrackTint ?? props.tint;
  if (props.activeTrackTint === LIQUID_GLASS_SWITCH_TRACK_GLASS) return props.tint;
  return props.activeTrackTint;
});
function toggle() {
  if (props.disabled) return;
  const next = !isOn.value;
  if (props.checked === undefined) internalChecked.value = next;
  emit('change', next);
}
</script>

<template>
  <button
    type="button"
    role="switch"
    :aria-checked="isOn"
    :aria-label="ariaLabel"
    :disabled="disabled"
    :class="className"
    :style="{ position: 'relative', width: `${width}px`, height: `${height}px`, padding: 0, border: 'none', background: 'none', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, ...style }"
    @click="toggle"
  >
    <LiquidGlass :width="width" :height="height" :border-radius="radius" :displacement-scale="displacementScale" :bezel-width="bezelWidth" :shadow-intensity="shadowIntensity" :tint="trackTint" :tint-fallback="tintFallback" :blur="blur" :saturation="saturation" :refraction-strength="refractionStrength" :show-specular="showSpecular" :style="{ position: 'absolute', inset: 0, pointerEvents: 'none' }" />
    <LiquidGlass :width="thumbSize" :height="thumbSize" :border-radius="999" :displacement-scale="displacementScale + 4" :bezel-width="Math.max(8, bezelWidth - 2)" :shadow-intensity="shadowIntensity" :tint="thumbTint ?? tint" :tint-fallback="tintFallback" :blur="blur" :saturation="saturation" :refraction-strength="refractionStrength" :show-specular="showSpecular" :style="{ position: 'absolute', top: `${padding}px`, left: `${padding}px`, transform: `translateX(${isOn ? travel : 0}px)`, transition: 'transform 0.32s cubic-bezier(0.34, 1.45, 0.64, 1)', pointerEvents: 'none' }" />
  </button>
</template>
