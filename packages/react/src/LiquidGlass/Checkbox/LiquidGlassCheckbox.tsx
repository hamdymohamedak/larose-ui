import { useCallback, useState, type ReactNode } from 'react';
import { LIQUID_GLASS_PRESETS } from '../engine/defaults';
import type { LiquidGlassChromeProps, LiquidGlassOptics } from '../engine/types';
import { LiquidGlass } from '../core/LiquidGlass';

export interface LiquidGlassCheckboxProps
  extends LiquidGlassOptics, LiquidGlassChromeProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  /** Box size in px. @default 26 */
  size?: number;
  borderRadius?: number;
  checkColor?: string;
  checkedTint?: string;
  label?: ReactNode;
  labelColor?: string;
  'aria-label'?: string;
}

function CheckIcon({ color }: { color: string }) {
  return (
    <svg
      aria-hidden
      width={14}
      height={14}
      viewBox="0 0 14 14"
      fill="none"
      style={{ display: 'block' }}
    >
      <path
        d="M2.5 7.2 5.8 10.5 11.5 3.8"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LiquidGlassCheckbox({
  checked: controlledChecked,
  defaultChecked = false,
  onChange,
  disabled = false,
  size = 26,
  borderRadius = LIQUID_GLASS_PRESETS.checkbox.borderRadius,
  checkColor = '#ffffff',
  checkedTint = 'rgba(52, 199, 89, 0.42)',
  label,
  labelColor = '#ffffff',
  className,
  style,
  'aria-label': ariaLabel,
  displacementScale = LIQUID_GLASS_PRESETS.checkbox.displacementScale,
  bezelWidth = LIQUID_GLASS_PRESETS.checkbox.bezelWidth,
  shadowIntensity = LIQUID_GLASS_PRESETS.checkbox.shadowIntensity,
  tint,
  tintFallback,
  ...optics
}: LiquidGlassCheckboxProps) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const checked = controlledChecked ?? internalChecked;

  const toggle = useCallback(() => {
    if (disabled) return;
    const next = !checked;
    if (controlledChecked === undefined) setInternalChecked(next);
    onChange?.(next);
  }, [checked, controlledChecked, disabled, onChange]);

  const box = (
    <LiquidGlass
      as="span"
      width={size}
      height={size}
      borderRadius={borderRadius}
      displacementScale={displacementScale}
      bezelWidth={bezelWidth}
      shadowIntensity={shadowIntensity}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        transition: 'transform 0.2s cubic-bezier(0.34, 1.45, 0.64, 1)',
        transform: checked ? 'scale(1.04)' : 'scale(1)',
      }}
      {...optics}
      tint={checked ? checkedTint : tint}
      tintFallback={tintFallback}
    >
      <span
        style={{
          opacity: checked ? 1 : 0,
          transform: checked ? 'scale(1)' : 'scale(0.6)',
          transition: 'opacity 0.18s ease, transform 0.22s cubic-bezier(0.34, 1.45, 0.64, 1)',
        }}
      >
        <CheckIcon color={checkColor} />
      </span>
    </LiquidGlass>
  );

  return (
    <label
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        userSelect: 'none',
        fontFamily: 'inherit',
        color: labelColor,
        fontSize: '0.9375rem',
        ...style,
      }}
    >
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={toggle}
        style={{
          padding: 0,
          border: 'none',
          background: 'none',
          lineHeight: 0,
          cursor: disabled ? 'not-allowed' : 'pointer',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        {box}
      </button>
      {label != null && <span>{label}</span>}
    </label>
  );
}
