import { useCallback, useState } from 'react';
import { LIQUID_GLASS_PRESETS } from '../engine/defaults';
import type { LiquidGlassChromeProps, LiquidGlassOptics } from '../engine/types';
import { LiquidGlass } from '../core/LiquidGlass';

/** iOS-style green used when the switch is on (default). */
export const LIQUID_GLASS_SWITCH_ACTIVE_GREEN = 'rgba(52, 199, 89, 0.45)';

/** Pass as `activeTrackTint` to keep liquid glass only — no color wash when on. */
export const LIQUID_GLASS_SWITCH_TRACK_GLASS = 'glass' as const;

export type LiquidGlassSwitchActiveTrackTint =
  | string
  | typeof LIQUID_GLASS_SWITCH_TRACK_GLASS;

export interface LiquidGlassSwitchProps
  extends LiquidGlassOptics, LiquidGlassChromeProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  /** Track width in px. @default 52 */
  width?: number;
  /** Track height in px. @default 32 */
  height?: number;
  /** Thumb diameter in px. @default 28 */
  thumbSize?: number;
  /** Track padding around thumb. @default 2 */
  padding?: number;
  borderRadius?: number;
  /**
   * Active track tint when on. Defaults to iOS-style green.
   * Pass `'glass'` ({@link LIQUID_GLASS_SWITCH_TRACK_GLASS}) for liquid glass only, or any CSS color.
   */
  activeTrackTint?: LiquidGlassSwitchActiveTrackTint;
  inactiveTrackTint?: string;
  thumbTint?: string;
  'aria-label'?: string;
}

function resolveSwitchTrackTint(
  checked: boolean,
  activeTrackTint: LiquidGlassSwitchActiveTrackTint,
  inactiveTrackTint: string | undefined,
  glassTint: string | undefined,
): string | undefined {
  if (!checked) return inactiveTrackTint ?? glassTint;
  if (activeTrackTint === LIQUID_GLASS_SWITCH_TRACK_GLASS) return glassTint;
  return activeTrackTint;
}

export function LiquidGlassSwitch({
  checked: controlledChecked,
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
  'aria-label': ariaLabel,
  tint,
  tintFallback,
  displacementScale = LIQUID_GLASS_PRESETS.switch.displacementScale,
  bezelWidth = LIQUID_GLASS_PRESETS.switch.bezelWidth,
  borderRadius = LIQUID_GLASS_PRESETS.switch.borderRadius,
  shadowIntensity = LIQUID_GLASS_PRESETS.switch.shadowIntensity,
  ...optics
}: LiquidGlassSwitchProps) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const checked = controlledChecked ?? internalChecked;
  const travel = Math.max(0, width - thumbSize - padding * 2);
  const trackTint = resolveSwitchTrackTint(
    checked,
    activeTrackTint,
    inactiveTrackTint,
    tint,
  );

  const toggle = useCallback(() => {
    if (disabled) return;
    const next = !checked;
    if (controlledChecked === undefined) setInternalChecked(next);
    onChange?.(next);
  }, [checked, controlledChecked, disabled, onChange]);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={toggle}
      className={className}
      style={{
        position: 'relative',
        width,
        height,
        padding: 0,
        border: 'none',
        background: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        WebkitTapHighlightColor: 'transparent',
        ...style,
      }}
    >
      <LiquidGlass
        width={width}
        height={height}
        borderRadius={borderRadius}
        displacementScale={displacementScale}
        bezelWidth={bezelWidth}
        shadowIntensity={shadowIntensity}
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        {...optics}
        tint={trackTint}
        tintFallback={tintFallback}
      />

      <LiquidGlass
        width={thumbSize}
        height={thumbSize}
        borderRadius={999}
        displacementScale={displacementScale + 4}
        bezelWidth={Math.max(8, bezelWidth - 2)}
        shadowIntensity={shadowIntensity}
        style={{
          position: 'absolute',
          top: padding,
          left: padding,
          transform: `translateX(${checked ? travel : 0}px)`,
          transition: 'transform 0.32s cubic-bezier(0.34, 1.45, 0.64, 1)',
          pointerEvents: 'none',
        }}
        {...optics}
        tint={thumbTint ?? tint}
        tintFallback={tintFallback}
      />
    </button>
  );
}
