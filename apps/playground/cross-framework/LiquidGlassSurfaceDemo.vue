<script setup lang="ts">
import LiquidGlass from '../../../packages/vue/src/LiquidGlass/core/LiquidGlass.vue';
import GlassScrollScene from './GlassScrollScene.vue';

withDefaults(
  defineProps<{
    label?: string;
    width?: number | string;
    height?: number | string;
    borderRadius?: number;
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
    label: 'Liquid glass',
    width: 280,
    height: 120,
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
        <LiquidGlass
          :width="width"
          :height="height"
          :border-radius="borderRadius"
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
          :style="{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 600,
          }"
        >
          {{ label }}
        </LiquidGlass>
      </div>
    </div>
  </GlassScrollScene>
</template>
