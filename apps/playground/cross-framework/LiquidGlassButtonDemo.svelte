<script lang="ts">
  import LiquidGlassButton from '../../../packages/svelte/src/lib/LiquidGlass/Button/LiquidGlassButton.svelte';
  import GlassScrollScene from './GlassScrollScene.svelte';

  let {
    label = 'Continue',
    width,
    height,
    borderRadius,
    color,
    disabled = false,
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
      <LiquidGlassButton
        {width}
        {height}
        {borderRadius}
        {color}
        {disabled}
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
      >
        {label}
      </LiquidGlassButton>
    </div>
  </div>
</GlassScrollScene>
