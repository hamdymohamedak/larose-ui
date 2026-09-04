<script lang="ts">
  import { LIQUID_GLASS_PRESETS } from '../engine/defaults';
  import type { LiquidGlassChromeProps, LiquidGlassGeometry, LiquidGlassOptics } from '../engine/types';
  import LiquidGlass from '../core/LiquidGlass.svelte';

  const FILL_INSET = 2;

  let {
    value = 0,
    max = 100,
    indeterminate = false,
    width = '100%',
    height = 10,
    className,
    style,
    ariaLabel,
    borderRadius = LIQUID_GLASS_PRESETS.progress.borderRadius,
    fillColor = 'rgba(255, 255, 255, 0.55)',
    fillGlow = 'rgba(255, 255, 255, 0.35)',
    displacementScale = LIQUID_GLASS_PRESETS.progress.displacementScale,
    bezelWidth = LIQUID_GLASS_PRESETS.progress.bezelWidth,
    shadowIntensity = LIQUID_GLASS_PRESETS.progress.shadowIntensity,
    ...optics
  }: LiquidGlassOptics &
    LiquidGlassGeometry &
    LiquidGlassChromeProps & {
      value?: number;
      max?: number;
      indeterminate?: boolean;
      width?: number | string;
      height?: number;
      fillColor?: string;
      fillGlow?: string;
      ariaLabel?: string;
    } = $props();

  const clampedMax = $derived(max > 0 ? max : 100);
  const pct = $derived(
    indeterminate ? 40 : Math.min(100, Math.max(0, (value / clampedMax) * 100)),
  );
  const fillRadius = $derived(Math.max(0, borderRadius - FILL_INSET));
  const fillWidth = $derived(
    indeterminate ? '40%' : `max(0px, calc(${pct}% - ${FILL_INSET * 2}px))`,
  );
  const rootWidth = $derived(typeof width === 'number' ? `${width}px` : width);
</script>

<div
  class={className}
  role="progressbar"
  aria-label={ariaLabel}
  aria-valuemin={0}
  aria-valuemax={clampedMax}
  aria-valuenow={indeterminate ? undefined : value}
  style="position:relative;width:{rootWidth};height:{height}px"
>
  <LiquidGlass
    width="100%"
    height="100%"
    {borderRadius}
    {displacementScale}
    {bezelWidth}
    {shadowIntensity}
    {...optics}
    style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
  />
  <div
    aria-hidden="true"
    style="position:absolute;inset:0;border-radius:{borderRadius}px;overflow:hidden;pointer-events:none"
  >
    <div
      style="
        position:absolute;top:{FILL_INSET}px;bottom:{FILL_INSET}px;left:{FILL_INSET}px;
        width:{fillWidth};border-radius:{fillRadius}px;
        background:linear-gradient(90deg, {fillColor}, {fillGlow});
        box-shadow:0 0 12px {fillGlow};
        {indeterminate
        ? 'animation:lg-progress-indeterminate 1.4s ease-in-out infinite;'
        : 'transition:width 0.35s cubic-bezier(0.22, 1, 0.36, 1);'}
      "
    ></div>
  </div>
  {#if indeterminate}
    <svelte:element this={'style'}>
      {'@keyframes lg-progress-indeterminate { 0% { transform: translateX(-120%); } 100% { transform: translateX(280%); } }'}
    </svelte:element>
  {/if}
</div>
