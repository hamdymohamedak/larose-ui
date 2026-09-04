<script lang="ts">
  import { LIQUID_GLASS_PRESETS } from '../engine/defaults';
  import type { LiquidGlassChromeProps, LiquidGlassGeometry, LiquidGlassOptics } from '../engine/types';
  import LiquidGlass from '../core/LiquidGlass.svelte';

  let {
    value,
    defaultValue = 50,
    min = 0,
    max = 100,
    step = 1,
    onChange,
    disabled = false,
    width = '100%',
    trackHeight = 8,
    thumbSize = 28,
    className,
    style,
    ariaLabel,
    fillColor = 'rgba(255, 255, 255, 0.35)',
    displacementScale = LIQUID_GLASS_PRESETS.slider.displacementScale,
    bezelWidth = LIQUID_GLASS_PRESETS.slider.bezelWidth,
    borderRadius = LIQUID_GLASS_PRESETS.slider.borderRadius,
    shadowIntensity = LIQUID_GLASS_PRESETS.slider.shadowIntensity,
    ...optics
  }: LiquidGlassOptics &
    LiquidGlassGeometry &
    LiquidGlassChromeProps & {
      value?: number;
      defaultValue?: number;
      min?: number;
      max?: number;
      step?: number;
      onChange?: (value: number) => void;
      disabled?: boolean;
      width?: number | string;
      trackHeight?: number;
      thumbSize?: number;
      fillColor?: string;
      ariaLabel?: string;
    } = $props();

  let internal = $state(defaultValue);
  const current = $derived(value ?? internal);
  const clamped = $derived(Math.min(max, Math.max(min, current)));
  const pct = $derived(max === min ? 0 : ((clamped - min) / (max - min)) * 100);

  function onInput(event: Event) {
    const next = Number((event.target as HTMLInputElement).value);
    if (value === undefined) internal = next;
    onChange?.(next);
  }
</script>

<div
  class={className}
  style="
    position:relative;
    width:{typeof width === 'number' ? `${width}px` : width};
    height:{thumbSize}px;
    display:flex;align-items:center;
    opacity:{disabled ? 0.5 : 1};
  "
>
  <LiquidGlass
    width="100%"
    height={trackHeight}
    {borderRadius}
    {displacementScale}
    {bezelWidth}
    {shadowIntensity}
    {...optics}
    style={{ position: 'absolute', left: 0, right: 0, pointerEvents: 'none' }}
  >
    <div
      aria-hidden="true"
      style="
        position:absolute;top:0;bottom:0;left:0;width:{pct}%;
        border-radius:inherit;background:{fillColor};
        transition:width 0.12s ease-out;
      "
    ></div>
  </LiquidGlass>

  <LiquidGlass
    width={thumbSize}
    height={thumbSize}
    borderRadius={999}
    displacementScale={displacementScale + 6}
    bezelWidth={Math.max(8, bezelWidth - 2)}
    {shadowIntensity}
    {...optics}
    style={{
      position: 'absolute',
      left: `calc(${pct}% - ${thumbSize / 2}px)`,
      top: '50%',
      transform: 'translateY(-50%)',
      transition: 'left 0.12s ease-out',
      pointerEvents: 'none',
    }}
  />

  <input
    type="range"
    {min}
    {max}
    {step}
    value={clamped}
    {disabled}
    aria-label={ariaLabel}
    style="position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:{disabled
      ? 'not-allowed'
      : 'pointer'}"
    oninput={onInput}
  />
</div>
