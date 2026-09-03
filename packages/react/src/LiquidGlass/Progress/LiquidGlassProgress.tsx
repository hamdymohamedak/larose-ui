import type { CSSProperties } from 'react';
import { LIQUID_GLASS_PRESETS } from '../engine/defaults';
import type { LiquidGlassOptics } from '../engine/types';
import { LiquidGlass } from '../core/LiquidGlass';

export interface LiquidGlassProgressProps extends LiquidGlassOptics {
  /** Current value. @default 0 */
  value?: number;
  /** Maximum value. @default 100 */
  max?: number;
  /** Indeterminate loading state. */
  indeterminate?: boolean;
  width?: number | string;
  /** Track height in px. @default 10 */
  height?: number;
  borderRadius?: number;
  fillColor?: string;
  fillGlow?: string;
  className?: string;
  style?: CSSProperties;
  'aria-label'?: string;
}

const FILL_INSET = 2;

export function LiquidGlassProgress({
  value = 0,
  max = 100,
  indeterminate = false,
  width = '100%',
  height = 10,
  borderRadius = LIQUID_GLASS_PRESETS.progress.borderRadius,
  fillColor = 'rgba(255, 255, 255, 0.55)',
  fillGlow = 'rgba(255, 255, 255, 0.35)',
  className,
  style,
  'aria-label': ariaLabel,
  tint,
  tintFallback,
  displacementScale = LIQUID_GLASS_PRESETS.progress.displacementScale,
  bezelWidth = LIQUID_GLASS_PRESETS.progress.bezelWidth,
  shadowIntensity = LIQUID_GLASS_PRESETS.progress.shadowIntensity,
  ...optics
}: LiquidGlassProgressProps) {
  const clampedMax = max > 0 ? max : 100;
  const pct = indeterminate ? 40 : Math.min(100, Math.max(0, (value / clampedMax) * 100));
  const fillRadius = Math.max(0, borderRadius - FILL_INSET);

  return (
    <div
      className={className}
      role="progressbar"
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={clampedMax}
      aria-valuenow={indeterminate ? undefined : value}
      style={{
        position: 'relative',
        width,
        height,
        ...style,
      }}
    >
      <LiquidGlass
        width="100%"
        height="100%"
        borderRadius={borderRadius}
        displacementScale={displacementScale}
        bezelWidth={bezelWidth}
        shadowIntensity={shadowIntensity}
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        {...optics}
        tint={tint}
        tintFallback={tintFallback}
      />

      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: FILL_INSET,
            bottom: FILL_INSET,
            left: FILL_INSET,
            width: indeterminate
              ? '40%'
              : `max(0px, calc(${pct}% - ${FILL_INSET * 2}px))`,
            borderRadius: fillRadius,
            background: `linear-gradient(90deg, ${fillColor}, ${fillGlow})`,
            boxShadow: `0 0 12px ${fillGlow}`,
            transition: indeterminate ? undefined : 'width 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
            animation: indeterminate ? 'lg-progress-indeterminate 1.4s ease-in-out infinite' : undefined,
          }}
        />
      </div>

      {indeterminate && (
        <style>{`
          @keyframes lg-progress-indeterminate {
            0% { transform: translateX(-120%); }
            100% { transform: translateX(280%); }
          }
        `}</style>
      )}
    </div>
  );
}
