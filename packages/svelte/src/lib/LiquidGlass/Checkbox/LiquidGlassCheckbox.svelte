<script lang="ts">
  import { LIQUID_GLASS_PRESETS } from '../engine/defaults';
  import type { LiquidGlassChromeProps, LiquidGlassGeometry, LiquidGlassOptics } from '../engine/types';
  import LiquidGlass from '../core/LiquidGlass.svelte';

  let {
    checked,
    defaultChecked = false,
    onChange,
    disabled = false,
    size = 26,
    label,
    labelColor = '#ffffff',
    ariaLabel,
    borderRadius = LIQUID_GLASS_PRESETS.checkbox.borderRadius,
    checkColor = '#ffffff',
    checkedTint = 'rgba(52, 199, 89, 0.42)',
    className,
    style,
    displacementScale = LIQUID_GLASS_PRESETS.checkbox.displacementScale,
    bezelWidth = LIQUID_GLASS_PRESETS.checkbox.bezelWidth,
    shadowIntensity = LIQUID_GLASS_PRESETS.checkbox.shadowIntensity,
    tint,
    tintFallback,
    ...optics
  }: LiquidGlassOptics &
    LiquidGlassGeometry &
    LiquidGlassChromeProps & {
      checked?: boolean;
      defaultChecked?: boolean;
      onChange?: (v: boolean) => void;
      disabled?: boolean;
      size?: number;
      label?: string;
      labelColor?: string;
      ariaLabel?: string;
      checkColor?: string;
      checkedTint?: string;
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

<label
  class={className}
  style="
    display:inline-flex;align-items:center;gap:10px;
    cursor:{disabled ? 'not-allowed' : 'pointer'};
    opacity:{disabled ? 0.5 : 1};
    user-select:none;font-family:inherit;color:{labelColor};font-size:0.9375rem;
  "
>
  <button
    type="button"
    role="checkbox"
    aria-checked={isOn}
    aria-label={ariaLabel}
    {disabled}
    onclick={toggle}
    style="
      padding:0;border:none;background:none;line-height:0;
      cursor:{disabled ? 'not-allowed' : 'pointer'};
      -webkit-tap-highlight-color:transparent;
    "
  >
    <LiquidGlass
      as="span"
      width={size}
      height={size}
      {borderRadius}
      {displacementScale}
      {bezelWidth}
      {shadowIntensity}
      {...optics}
      tint={isOn ? checkedTint : tint}
      {tintFallback}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        transition: 'transform 0.2s cubic-bezier(0.34, 1.45, 0.64, 1)',
        transform: isOn ? 'scale(1.04)' : 'scale(1)',
        ...style,
      }}
    >
      <span
        style="
          opacity:{isOn ? 1 : 0};
          transform:{isOn ? 'scale(1)' : 'scale(0.6)'};
          transition:opacity 0.18s ease, transform 0.22s cubic-bezier(0.34, 1.45, 0.64, 1);
        "
      >
        <svg
          aria-hidden="true"
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          style="display:block"
        >
          <path
            d="M2.5 7.2 5.8 10.5 11.5 3.8"
            stroke={checkColor}
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>
    </LiquidGlass>
  </button>
  {#if label != null}<span>{label}</span>{/if}
</label>
