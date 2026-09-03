import {
  useCallback,
  useMemo,
  useState,
  type ChangeEvent,
  type CSSProperties,
} from 'react';
import { LIQUID_GLASS_PRESETS } from '../engine/defaults';
import type { LiquidGlassOptics } from '../engine/types';
import { LiquidGlass } from '../core/LiquidGlass';

export interface LiquidGlassRangeProps extends LiquidGlassOptics {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
  width?: number | string;
  /** Track height in px. @default 8 */
  trackHeight?: number;
  /** Thumb diameter in px. @default 28 */
  thumbSize?: number;
  borderRadius?: number;
  fillColor?: string;
  className?: string;
  style?: CSSProperties;
  'aria-label'?: string;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function LiquidGlassRange({
  value: controlledValue,
  defaultValue = 50,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  disabled = false,
  width = '100%',
  trackHeight = 8,
  thumbSize = 28,
  fillColor = 'rgba(255, 255, 255, 0.35)',
  className,
  style,
  'aria-label': ariaLabel,
  displacementScale = LIQUID_GLASS_PRESETS.slider.displacementScale,
  bezelWidth = LIQUID_GLASS_PRESETS.slider.bezelWidth,
  borderRadius = LIQUID_GLASS_PRESETS.slider.borderRadius,
  shadowIntensity = LIQUID_GLASS_PRESETS.slider.shadowIntensity,
  ...optics
}: LiquidGlassRangeProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = controlledValue ?? internalValue;
  const pct = useMemo(() => {
    if (max === min) return 0;
    return ((clamp(value, min, max) - min) / (max - min)) * 100;
  }, [max, min, value]);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const next = Number(event.target.value);
      if (controlledValue === undefined) setInternalValue(next);
      onChange?.(next);
    },
    [controlledValue, onChange],
  );

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width,
        height: thumbSize,
        display: 'flex',
        alignItems: 'center',
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
    >
      <LiquidGlass
        width="100%"
        height={trackHeight}
        borderRadius={borderRadius}
        displacementScale={displacementScale}
        bezelWidth={bezelWidth}
        shadowIntensity={shadowIntensity}
        style={{ position: 'absolute', left: 0, right: 0, pointerEvents: 'none' }}
        {...optics}
      >
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            width: `${pct}%`,
            borderRadius: 'inherit',
            background: fillColor,
            transition: 'width 0.12s ease-out',
          }}
        />
      </LiquidGlass>

      <LiquidGlass
        width={thumbSize}
        height={thumbSize}
        borderRadius={999}
        displacementScale={displacementScale + 6}
        bezelWidth={Math.max(8, bezelWidth - 2)}
        shadowIntensity={shadowIntensity}
        style={{
          position: 'absolute',
          left: `calc(${pct}% - ${thumbSize / 2}px)`,
          top: '50%',
          transform: 'translateY(-50%)',
          transition: 'left 0.12s ease-out',
          pointerEvents: 'none',
        }}
        {...optics}
      />

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={clamp(value, min, max)}
        disabled={disabled}
        aria-label={ariaLabel}
        onChange={handleChange}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          margin: 0,
          opacity: 0,
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      />
    </div>
  );
}
