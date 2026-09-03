<script setup lang="ts">
import { computed, useAttrs, type CSSProperties } from 'vue';
import type { LiquidGlassSurfaceProps } from '../engine/types';
import { splitLiquidGlassLayoutStyle } from './splitLayoutStyle';
import { useLiquidGlass } from './useLiquidGlass';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<LiquidGlassSurfaceProps>(), {
  as: 'div',
  borderRadius: 30,
});
const attrs = useAttrs();
const {
  shellRef,
  filterId,
  mapDataUrl,
  supportsRefraction,
  optics,
  shellStyle,
} = useLiquidGlass(() => ({
  borderRadius: props.borderRadius,
  onDisplacementMapChange: props.onDisplacementMapChange,
  blur: props.blur,
  saturation: props.saturation,
  tint: props.tint,
  tintFallback: props.tintFallback,
  displacementScale: props.displacementScale,
  bezelWidth: props.bezelWidth,
  refractionStrength: props.refractionStrength,
  showSpecular: props.showSpecular,
  specularAngle: props.specularAngle,
  specularTopOpacity: props.specularTopOpacity,
  specularEdgeOpacity: props.specularEdgeOpacity,
  innerTopHighlight: props.innerTopHighlight,
  innerBottomShadow: props.innerBottomShadow,
  shadowIntensity: props.shadowIntensity,
  borderColor: props.borderColor,
}));
const layout = computed(() => splitLiquidGlassLayoutStyle(props.style));
const geometryStyle = computed((): CSSProperties => ({
  position: 'relative',
  width: props.width,
  height: props.height,
  minWidth: props.minWidth,
  maxWidth: props.maxWidth,
  minHeight: props.minHeight,
  maxHeight: props.maxHeight,
  borderRadius: props.borderRadius,
  boxSizing: 'border-box',
  ...shellStyle.value,
  ...layout.value.shell,
}));

function setShell(el: unknown) {
  const node =
    el && typeof el === 'object' && '$el' in el
      ? (el as { $el: HTMLElement }).$el
      : (el as HTMLElement | null);
  shellRef.value = node ?? null;
}
</script>

<template>
  <svg
    v-if="supportsRefraction"
    aria-hidden="true"
    focusable="false"
    width="0"
    height="0"
    style="position: absolute; overflow: hidden"
  >
    <defs>
      <filter
        :id="filterId"
        x="-15%"
        y="-40%"
        width="130%"
        height="180%"
        color-interpolation-filters="sRGB"
      >
        <feImage
          v-if="mapDataUrl"
          :href="mapDataUrl"
          x="0"
          y="0"
          width="100%"
          height="100%"
          result="displacement_map"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="displacement_map"
          :scale="optics.displacementScale"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </defs>
  </svg>
  <component
    :is="as"
    :ref="setShell"
    :class="className"
    :style="geometryStyle"
    :aria-label="props['aria-label']"
    v-bind="attrs"
  >
    <div
      v-if="optics.showSpecular"
      aria-hidden="true"
      :style="{
        position: 'absolute',
        inset: 0,
        borderRadius: 'inherit',
        padding: '1px',
        pointerEvents: 'none',
        mixBlendMode: 'screen',
        background: `conic-gradient(from ${optics.specularAngle}deg at 50% 0%, rgba(255,255,255,${optics.specularTopOpacity}), rgba(255,255,255,0) 30%, rgba(255,255,255,0) 70%, rgba(255,255,255,${optics.specularEdgeOpacity}) 100%)`,
      }"
    />
    <div
      aria-hidden="true"
      :style="{
        position: 'absolute',
        inset: 0,
        borderRadius: 'inherit',
        pointerEvents: 'none',
        boxShadow: `inset 0 1px 0 rgba(255,255,255,${optics.innerTopHighlight}), inset 0 -6px 14px rgba(0,0,0,${optics.innerBottomShadow})`,
      }"
    />
    <div :style="{ position: 'relative', zIndex: 1, width: '100%', height: '100%', boxSizing: 'border-box', ...(layout.content as CSSProperties) }">
      <slot />
    </div>
  </component>
</template>
