<script lang="ts">
  import { LIQUID_GLASS_PRESETS } from '../engine/defaults';
  import type { LiquidGlassChromeProps, LiquidGlassGeometry, LiquidGlassOptics } from '../engine/types';
  import LiquidGlass from '../core/LiquidGlass.svelte';

  let {
    checked, defaultChecked = false, onChange, disabled = false, size = 26, label, ariaLabel,
    borderRadius = LIQUID_GLASS_PRESETS.checkbox.borderRadius, checkColor = '#ffffff',
    checkedTint = 'rgba(52, 199, 89, 0.42)', className,
    displacementScale = LIQUID_GLASS_PRESETS.checkbox.displacementScale,
    bezelWidth = LIQUID_GLASS_PRESETS.checkbox.bezelWidth,
    shadowIntensity = LIQUID_GLASS_PRESETS.checkbox.shadowIntensity, tint, tintFallback, ...optics
  }: LiquidGlassOptics & LiquidGlassGeometry & LiquidGlassChromeProps & {
    checked?: boolean; defaultChecked?: boolean; onChange?: (v: boolean) => void; disabled?: boolean;
    size?: number; label?: string; ariaLabel?: string; checkColor?: string; checkedTint?: string;
  } = $props();

  let internal = $state(defaultChecked);
  const isOn = $derived(checked ?? internal);
  function toggle() {
    if (disabled) return;
    const next = !isOn;
    if (checked === undefined) internal = next;
    onChange?.(next);
  }
</script>

<label class={className} style="display:inline-flex;align-items:center;gap:10px">
  <button type="button" role="checkbox" aria-checked={isOn} aria-label={ariaLabel} {disabled} onclick={toggle} style="padding:0;border:none;background:none">
    <LiquidGlass as="span" width={size} height={size} {borderRadius} {displacementScale} {bezelWidth} {shadowIntensity} {...optics} tint={isOn ? checkedTint : tint} {tintFallback}>
      <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none" style="opacity:{isOn ? 1 : 0}">
        <path d="M2.5 7.2 5.8 10.5 11.5 3.8" stroke={checkColor} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </LiquidGlass>
  </button>
  {#if label}<span>{label}</span>{/if}
</label>
