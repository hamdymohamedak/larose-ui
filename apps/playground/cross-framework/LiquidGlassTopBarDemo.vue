<script setup lang="ts">
import { ref, watch } from 'vue';
import LiquidGlassTopBar from '../../../packages/vue/src/LiquidGlass/TopBar/LiquidGlassTopBar.vue';
import GlassScrollScene from './GlassScrollScene.vue';

const TOP_BAR_NAV_ITEMS = [
  { key: 'home', label: 'Home' },
  { key: 'discover', label: 'Discover' },
  { key: 'library', label: 'Library' },
];

const props = withDefaults(
  defineProps<{
    title?: string;
    defaultActiveKey?: string;
    variant?: 'floating' | 'edge';
    height?: number;
    showTrailing?: boolean;
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
    title: 'laRose',
    defaultActiveKey: 'home',
    variant: 'floating',
    height: 56,
    showTrailing: true,
  },
);

const active = ref(props.defaultActiveKey);

watch(
  () => props.defaultActiveKey,
  (key) => {
    if (key) active.value = key;
  },
);
</script>

<template>
  <GlassScrollScene :content-padding-bottom="120">
    <LiquidGlassTopBar
      :title="title"
      :items="TOP_BAR_NAV_ITEMS"
      :active-key="active"
      :variant="variant"
      :height="height"
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
        position: 'fixed',
        top: variant === 'edge' ? '0' : '14px',
        left: variant === 'edge' ? '0' : '16px',
        right: variant === 'edge' ? '0' : '16px',
        zIndex: 20,
        pointerEvents: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        color: '#fff',
      }"
      @change="active = $event"
    >
      <template v-if="showTrailing" #trailing>
        <button
          type="button"
          aria-label="Settings"
          style="
            display: flex;
            align-items: center;
            justify-content: center;
            width: 34px;
            height: 34px;
            border-radius: 999px;
            border: none;
            background: rgba(255, 255, 255, 0.1);
            box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.18);
            color: rgba(255, 255, 255, 0.85);
            font-size: 16px;
            cursor: pointer;
          "
        >
          ⚙
        </button>
      </template>
    </LiquidGlassTopBar>
  </GlassScrollScene>
</template>
