<script setup lang="ts">
import { computed, ref } from 'vue';
import { LIQUID_GLASS_PRESETS } from '../engine/defaults';
import type { LiquidGlassChromeProps, LiquidGlassOptics } from '../engine/types';
import LiquidGlass from '../core/LiquidGlass.vue';
import { normalizeGlassStyle } from '../core/normalizeGlassStyle';
import {
  LIQUID_GLASS_SWITCH_ACTIVE_GREEN,
  LIQUID_GLASS_SWITCH_TRACK_GLASS,
} from './constants';

const props = withDefaults(
  defineProps<
    LiquidGlassOptics &
      LiquidGlassChromeProps & {
        checked?: boolean;
        defaultChecked?: boolean;
        disabled?: boolean;
        width?: number;
        height?: number;
        thumbSize?: number;
        padding?: number;
        borderRadius?: number;
        activeTrackTint?: string;
        inactiveTrackTint?: string;
        thumbTint?: string;
        ariaLabel?: string;
      }
  >(),
  {
    // undefined — not false — so omitted `checked` stays uncontrolled (Vue Boolean cast).
    checked: undefined,
    defaultChecked: false,
    disabled: false,
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
const internalChecked = ref(props.defaultChecked);
const isControlled = computed(() => props.checked !== undefined);
const isOn = computed(() => (isControlled.value ? !!props.checked : internalChecked.value));
const travel = computed(() => Math.max(0, props.width - props.thumbSize - props.padding * 2));
const trackTint = computed(() => {
  if (!isOn.value) return props.inactiveTrackTint ?? props.tint;
  if (props.activeTrackTint === LIQUID_GLASS_SWITCH_TRACK_GLASS) return props.tint;
  return props.activeTrackTint;
});
const thumbBezel = computed(() => Math.max(8, props.bezelWidth - 2));
const thumbDisplacement = computed(() => props.displacementScale + 4);
const rootStyle = computed(() =>
  normalizeGlassStyle({
    position: 'relative',
    width: props.width,
    height: props.height,
    padding: 0,
    border: 'none',
    background: 'none',
    cursor: props.disabled ? 'not-allowed' : 'pointer',
    opacity: props.disabled ? 0.5 : 1,
    WebkitTapHighlightColor: 'transparent',
    ...props.style,
  }),
);

function toggle() {
  if (props.disabled) return;
  const next = !isOn.value;
  if (!isControlled.value) internalChecked.value = next;
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
    :style="rootStyle"
    @click="toggle"
  >
    <LiquidGlass
      :width="width"
      :height="height"
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
      :tint="trackTint"
      :tint-fallback="tintFallback"
      :style="{ position: 'absolute', inset: 0, pointerEvents: 'none' }"
    />
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
      :tint="thumbTint ?? tint"
      :tint-fallback="tintFallback"
      :style="{
        position: 'absolute',
        top: `${padding}px`,
        left: `${padding}px`,
        transform: `translateX(${isOn ? travel : 0}px)`,
        transition: 'transform 0.32s cubic-bezier(0.34, 1.45, 0.64, 1)',
        pointerEvents: 'none',
      }"
    />
  </button>
</template>
