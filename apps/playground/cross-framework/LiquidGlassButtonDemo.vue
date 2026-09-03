<script setup lang="ts">
import LiquidGlassButton from '../../../packages/vue/src/LiquidGlass/Button/LiquidGlassButton.vue';
import GlassScrollScene from './GlassScrollScene.vue';

withDefaults(
  defineProps<{
    label?: string;
    width?: number | string;
    height?: number | string;
    borderRadius?: number;
    color?: string;
    disabled?: boolean;
    blur?: number;
    saturation?: number;
    tint?: string;
    tintFallback?: string;
    displacementScale?: number;
    bezelWidth?: number;
    refractionStrength?: number;
    showSpecular?: boolean;
    specularAngle?: number;
    specularTopOpacity?: number;
    specularEdgeOpacity?: number;
    innerTopHighlight?: number;
    innerBottomShadow?: number;
    shadowIntensity?: number;
    borderColor?: string;
  }>(),
  {
    label: 'Continue',
  },
);
</script>

<template>
  <GlassScrollScene :content-padding-bottom="80">
    <div
      style="
        position: fixed;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
      "
    >
      <div style="pointer-events: auto">
        <LiquidGlassButton
          :width="width"
          :height="height"
          :border-radius="borderRadius"
          :color="color"
          :disabled="disabled"
          :blur="blur"
          :saturation="saturation"
          :tint="tint"
          :tint-fallback="tintFallback"
          :displacement-scale="displacementScale"
          :bezel-width="bezelWidth"
          :refraction-strength="refractionStrength"
          :show-specular="showSpecular"
          :specular-angle="specularAngle"
          :specular-top-opacity="specularTopOpacity"
          :specular-edge-opacity="specularEdgeOpacity"
          :inner-top-highlight="innerTopHighlight"
          :inner-bottom-shadow="innerBottomShadow"
          :shadow-intensity="shadowIntensity"
          :border-color="borderColor"
        >
          {{ label }}
        </LiquidGlassButton>
      </div>
    </div>
  </GlassScrollScene>
</template>
