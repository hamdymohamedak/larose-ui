<script setup lang="ts">
import { computed } from 'vue';
import { LIQUID_GLASS_PRESETS } from '../engine/defaults';
import type { LiquidGlassChromeProps, LiquidGlassOptics } from '../engine/types';
import LiquidGlass from '../core/LiquidGlass.vue';
import { normalizeGlassStyle } from '../core/normalizeGlassStyle';

const FILL_INSET = 2;

const props = withDefaults(
  defineProps<
    LiquidGlassOptics &
      LiquidGlassChromeProps & {
        value?: number;
        max?: number;
        indeterminate?: boolean;
        width?: number | string;
        height?: number;
        borderRadius?: number;
        fillColor?: string;
        fillGlow?: string;
        ariaLabel?: string;
      }
  >(),
  {
    value: 0,
    max: 100,
    indeterminate: false,
    width: '100%',
    height: 10,
    borderRadius: LIQUID_GLASS_PRESETS.progress.borderRadius,
    fillColor: 'rgba(255, 255, 255, 0.55)',
    fillGlow: 'rgba(255, 255, 255, 0.35)',
    displacementScale: LIQUID_GLASS_PRESETS.progress.displacementScale,
    bezelWidth: LIQUID_GLASS_PRESETS.progress.bezelWidth,
    shadowIntensity: LIQUID_GLASS_PRESETS.progress.shadowIntensity,
  },
);

const clampedMax = computed(() => (props.max > 0 ? props.max : 100));
const pct = computed(() =>
  props.indeterminate
    ? 40
    : Math.min(100, Math.max(0, (props.value / clampedMax.value) * 100)),
);
const fillRadius = computed(() => Math.max(0, props.borderRadius - FILL_INSET));
const rootStyle = computed(() =>
  normalizeGlassStyle({
    position: 'relative',
    width: props.width,
    height: props.height,
    ...props.style,
  }),
);
const clipStyle = computed(() =>
  normalizeGlassStyle({
    position: 'absolute',
    inset: 0,
    borderRadius: props.borderRadius,
    overflow: 'hidden',
    pointerEvents: 'none',
  }),
);
const fillStyle = computed(() =>
  normalizeGlassStyle({
    position: 'absolute',
    top: FILL_INSET,
    bottom: FILL_INSET,
    left: FILL_INSET,
    width: props.indeterminate
      ? '40%'
      : `max(0px, calc(${pct.value}% - ${FILL_INSET * 2}px))`,
    borderRadius: fillRadius.value,
    background: `linear-gradient(90deg, ${props.fillColor}, ${props.fillGlow})`,
    boxShadow: `0 0 12px ${props.fillGlow}`,
    transition: props.indeterminate
      ? undefined
      : 'width 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
    animation: props.indeterminate
      ? 'lg-progress-indeterminate 1.4s ease-in-out infinite'
      : undefined,
  }),
);
</script>

<template>
  <div
    :class="className"
    role="progressbar"
    :aria-label="ariaLabel"
    :aria-valuemin="0"
    :aria-valuemax="clampedMax"
    :aria-valuenow="indeterminate ? undefined : value"
    :style="rootStyle"
  >
    <LiquidGlass
      width="100%"
      height="100%"
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
      :style="{ position: 'absolute', inset: 0, pointerEvents: 'none' }"
    />
    <div aria-hidden="true" :style="clipStyle">
      <div :style="fillStyle" />
    </div>
    <component :is="'style'" v-if="indeterminate">
      @keyframes lg-progress-indeterminate {
        0% { transform: translateX(-120%); }
        100% { transform: translateX(280%); }
      }
    </component>
  </div>
</template>
