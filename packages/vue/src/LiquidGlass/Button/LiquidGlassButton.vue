<script setup lang="ts">
import { LIQUID_GLASS_PRESETS } from '../engine/defaults';
import type { LiquidGlassChromeProps, LiquidGlassOptics } from '../engine/types';
import LiquidGlass from '../core/LiquidGlass.vue';

defineOptions({ inheritAttrs: false });
withDefaults(
  defineProps<
    LiquidGlassOptics &
      LiquidGlassChromeProps & {
        width?: number | string;
        height?: number | string;
        borderRadius?: number;
        color?: string;
        fontSize?: string | number;
        fontWeight?: number;
        disabled?: boolean;
        type?: 'button' | 'submit' | 'reset';
      }
  >(),
  {
    width: 140,
    height: 48,
    borderRadius: LIQUID_GLASS_PRESETS.button.borderRadius,
    color: '#ffffff',
    fontSize: '0.9375rem',
    fontWeight: 500,
    type: 'button',
    displacementScale: LIQUID_GLASS_PRESETS.button.displacementScale,
    bezelWidth: LIQUID_GLASS_PRESETS.button.bezelWidth,
    shadowIntensity: LIQUID_GLASS_PRESETS.button.shadowIntensity,
  },
);
</script>

<template>
  <LiquidGlass
    as="button"
    :type="type"
    :disabled="disabled"
    :class="className"
    :width="width"
    :height="height"
    :border-radius="borderRadius"
    :displacement-scale="displacementScale"
    :bezel-width="bezelWidth"
    :shadow-intensity="shadowIntensity"
    :blur="blur"
    :saturation="saturation"
    :tint="tint"
    :tint-fallback="tintFallback"
    :refraction-strength="refractionStrength"
    :show-specular="showSpecular"
    :specular-angle="specularAngle"
    :specular-top-opacity="specularTopOpacity"
    :specular-edge-opacity="specularEdgeOpacity"
    :inner-top-highlight="innerTopHighlight"
    :inner-bottom-shadow="innerBottomShadow"
    :border-color="borderColor"
    :style="{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      fontFamily: 'inherit',
      color,
      fontSize,
      fontWeight,
      padding: '0 1.25rem',
      ...style,
    }"
    v-bind="$attrs"
  >
    <slot />
  </LiquidGlass>
</template>
