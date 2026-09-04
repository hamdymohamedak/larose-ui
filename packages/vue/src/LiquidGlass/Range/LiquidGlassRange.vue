<script setup lang="ts">
import { computed, ref } from 'vue';
import { LIQUID_GLASS_PRESETS } from '../engine/defaults';
import type { LiquidGlassChromeProps, LiquidGlassOptics } from '../engine/types';
import LiquidGlass from '../core/LiquidGlass.vue';
import { normalizeGlassStyle } from '../core/normalizeGlassStyle';

const props = withDefaults(
  defineProps<
    LiquidGlassOptics &
      LiquidGlassChromeProps & {
        value?: number;
        defaultValue?: number;
        min?: number;
        max?: number;
        step?: number;
        disabled?: boolean;
        width?: number | string;
        trackHeight?: number;
        thumbSize?: number;
        borderRadius?: number;
        fillColor?: string;
        ariaLabel?: string;
      }
  >(),
  {
    defaultValue: 50,
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
    width: '100%',
    trackHeight: 8,
    thumbSize: 28,
    fillColor: 'rgba(255, 255, 255, 0.35)',
    displacementScale: LIQUID_GLASS_PRESETS.slider.displacementScale,
    bezelWidth: LIQUID_GLASS_PRESETS.slider.bezelWidth,
    borderRadius: LIQUID_GLASS_PRESETS.slider.borderRadius,
    shadowIntensity: LIQUID_GLASS_PRESETS.slider.shadowIntensity,
  },
);

const emit = defineEmits<{ change: [value: number] }>();
const internal = ref(props.defaultValue);
const current = computed(() => props.value ?? internal.value);
const clamped = computed(() => Math.min(props.max, Math.max(props.min, current.value)));
const pct = computed(() => {
  if (props.max === props.min) return 0;
  return ((clamped.value - props.min) / (props.max - props.min)) * 100;
});
const thumbBezel = computed(() => Math.max(8, props.bezelWidth - 2));
const thumbDisplacement = computed(() => props.displacementScale + 6);
const rootStyle = computed(() =>
  normalizeGlassStyle({
    position: 'relative',
    width: props.width,
    height: props.thumbSize,
    display: 'flex',
    alignItems: 'center',
    opacity: props.disabled ? 0.5 : 1,
    ...props.style,
  }),
);

function onInput(event: Event) {
  const next = Number((event.target as HTMLInputElement).value);
  if (props.value === undefined) internal.value = next;
  emit('change', next);
}
</script>

<template>
  <div :class="className" :style="rootStyle">
    <LiquidGlass
      width="100%"
      :height="trackHeight"
      :border-radius="borderRadius"
      :displacement-scale="displacementScale"
      :bezel-width="bezelWidth"
      :shadow-intensity="shadowIntensity"
      :blur="blur"
      :saturation="saturation"
      :refraction-strength="refractionStrength"
      :show-specular="showSpecular"
      :specular-angle="specularAngle"
      :specular-top-opacity="specularTopOpacity"
      :specular-edge-opacity="specularEdgeOpacity"
      :inner-top-highlight="innerTopHighlight"
      :inner-bottom-shadow="innerBottomShadow"
      :border-color="borderColor"
      :tint="tint"
      :tint-fallback="tintFallback"
      :style="{ position: 'absolute', left: 0, right: 0, pointerEvents: 'none' }"
    >
      <div
        aria-hidden="true"
        :style="{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          width: `${pct}%`,
          borderRadius: 'inherit',
          background: fillColor,
          transition: 'width 0.12s ease-out',
        }"
      />
    </LiquidGlass>

    <LiquidGlass
      :width="thumbSize"
      :height="thumbSize"
      :border-radius="999"
      :displacement-scale="thumbDisplacement"
      :bezel-width="thumbBezel"
      :shadow-intensity="shadowIntensity"
      :blur="blur"
      :saturation="saturation"
      :refraction-strength="refractionStrength"
      :show-specular="showSpecular"
      :specular-angle="specularAngle"
      :specular-top-opacity="specularTopOpacity"
      :specular-edge-opacity="specularEdgeOpacity"
      :inner-top-highlight="innerTopHighlight"
      :inner-bottom-shadow="innerBottomShadow"
      :border-color="borderColor"
      :tint="tint"
      :tint-fallback="tintFallback"
      :style="{
        position: 'absolute',
        left: `calc(${pct}% - ${thumbSize / 2}px)`,
        top: '50%',
        transform: 'translateY(-50%)',
        transition: 'left 0.12s ease-out',
        pointerEvents: 'none',
      }"
    />

    <input
      type="range"
      :min="min"
      :max="max"
      :step="step"
      :value="clamped"
      :disabled="disabled"
      :aria-label="ariaLabel"
      :style="{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        margin: 0,
        opacity: 0,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }"
      @input="onInput"
    />
  </div>
</template>
