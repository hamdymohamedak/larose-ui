<script lang="ts">
  import LiquidGlass from '../../../packages/svelte/src/lib/LiquidGlass/core/LiquidGlass.svelte';
  import GlassScrollScene from './GlassScrollScene.svelte';

  let {
    label = 'Liquid glass',
    width = 280,
    height = 120,
    borderRadius,
    blur,
    saturation,
    tint,
    tintFallback,
    displacementScale,
    bezelWidth,
    refractionStrength,
    showSpecular,
    specularAngle,
    specularTopOpacity,
    specularEdgeOpacity,
    innerTopHighlight,
    innerBottomShadow,
    shadowIntensity,
    borderColor,
  }: {
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
  } = $props();
</script>

<GlassScrollScene contentPaddingBottom={80}>
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
        {width}
        {height}
        {borderRadius}
        {blur}
        {saturation}
        {tint}
        {tintFallback}
        {displacementScale}
        {bezelWidth}
        {refractionStrength}
        {showSpecular}
        {specularAngle}
        {specularTopOpacity}
        {specularEdgeOpacity}
        {innerTopHighlight}
        {innerBottomShadow}
        {shadowIntensity}
        {borderColor}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 600,
        }}
      >
        {label}
      </LiquidGlass>
    </div>
  </div>
</GlassScrollScene>
