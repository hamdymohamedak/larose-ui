<script lang="ts">
  import { LIQUID_GLASS_PRESETS } from '../engine/defaults';
  import type { LiquidGlassChromeProps, LiquidGlassGeometry, LiquidGlassOptics } from '../engine/types';
  import LiquidGlass from '../core/LiquidGlass.svelte';
  import { LIQUID_GLASS_SWITCH_ACTIVE_GREEN, LIQUID_GLASS_SWITCH_TRACK_GLASS } from './constants';

  let {
    checked,
    defaultChecked = false,
    onChange,
    disabled = false,
    width = 52,
    height = 32,
    thumbSize = 28,
    padding = 2,
    activeTrackTint = LIQUID_GLASS_SWITCH_ACTIVE_GREEN,
    inactiveTrackTint,
    thumbTint,
    className,
    style,
    ariaLabel,
    tint,
    tintFallback,
    displacementScale = LIQUID_GLASS_PRESETS.switch.displacementScale,
    bezelWidth = LIQUID_GLASS_PRESETS.switch.bezelWidth,
    borderRadius = LIQUID_GLASS_PRESETS.switch.borderRadius,
    shadowIntensity = LIQUID_GLASS_PRESETS.switch.shadowIntensity,
    ...optics
  }: LiquidGlassOptics &
    LiquidGlassGeometry &
    LiquidGlassChromeProps & {
      checked?: boolean;
      defaultChecked?: boolean;
      onChange?: (checked: boolean) => void;
      disabled?: boolean;
      width?: number;
      height?: number;
      thumbSize?: number;
      padding?: number;
      activeTrackTint?: string;
      inactiveTrackTint?: string;
      thumbTint?: string;
      ariaLabel?: string;
    } = $props();

  let internalChecked = $state(defaultChecked);
  const isOn = $derived(checked ?? internalChecked);
  const travel = $derived(Math.max(0, width - thumbSize - padding * 2));
  const trackTint = $derived(
    !isOn
      ? (inactiveTrackTint ?? tint)
      : activeTrackTint === LIQUID_GLASS_SWITCH_TRACK_GLASS
        ? tint
        : activeTrackTint,
  );

  function toggle() {
    if (disabled) return;
    const next = !isOn;
    if (checked === undefined) internalChecked = next;
    onChange?.(next);
  }
</script>

<button
  type="button"
  role="switch"
  aria-checked={isOn}
  aria-label={ariaLabel}
  {disabled}
  class={className}
  style="
    position:relative;width:{width}px;height:{height}px;padding:0;border:none;background:none;
    cursor:{disabled ? 'not-allowed' : 'pointer'};
    opacity:{disabled ? 0.5 : 1};
    -webkit-tap-highlight-color:transparent;
  "
  onclick={toggle}
>
  <LiquidGlass
    {width}
    {height}
    {borderRadius}
    {displacementScale}
    {bezelWidth}
    {shadowIntensity}
    {...optics}
    tint={trackTint}
    {tintFallback}
    style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
  />
  <LiquidGlass
    width={thumbSize}
    height={thumbSize}
    borderRadius={999}
    displacementScale={displacementScale + 4}
    bezelWidth={Math.max(8, bezelWidth - 2)}
    {shadowIntensity}
    {...optics}
    tint={thumbTint ?? tint}
    {tintFallback}
    style={{
      position: 'absolute',
      top: `${padding}px`,
      left: `${padding}px`,
      transform: `translateX(${isOn ? travel : 0}px)`,
      transition: 'transform 0.32s cubic-bezier(0.34, 1.45, 0.64, 1)',
      pointerEvents: 'none',
    }}
  />
</button>
