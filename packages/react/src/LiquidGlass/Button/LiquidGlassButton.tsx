import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { LIQUID_GLASS_PRESETS } from '../engine/defaults';
import type { LiquidGlassChromeProps, LiquidGlassOptics } from '../engine/types';
import { LiquidGlass } from '../core/LiquidGlass';

export interface LiquidGlassButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'style'>,
    LiquidGlassOptics,
    LiquidGlassChromeProps {
  children: ReactNode;
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  /** Text/icon colour. @default #ffffff */
  color?: string;
  /** Font size. @default 0.9375rem */
  fontSize?: string | number;
  /** Font weight. @default 500 */
  fontWeight?: number;
}

/**
 * Pill-shaped button with the shared liquid glass refraction surface.
 */
export function LiquidGlassButton({
  children,
  width = 140,
  height = 48,
  borderRadius = LIQUID_GLASS_PRESETS.button.borderRadius,
  color = '#ffffff',
  fontSize = '0.9375rem',
  fontWeight = 500,
  className,
  style,
  disabled,
  type = 'button',
  displacementScale = LIQUID_GLASS_PRESETS.button.displacementScale,
  bezelWidth = LIQUID_GLASS_PRESETS.button.bezelWidth,
  shadowIntensity = LIQUID_GLASS_PRESETS.button.shadowIntensity,
  ...rest
}: LiquidGlassButtonProps) {
  const {
    blur,
    saturation,
    tint,
    tintFallback,
    refractionStrength,
    showSpecular,
    specularAngle,
    specularTopOpacity,
    specularEdgeOpacity,
    innerTopHighlight,
    innerBottomShadow,
    borderColor,
    ...buttonProps
  } = rest;

  return (
    <LiquidGlass
      as="button"
      type={type}
      disabled={disabled}
      className={className}
      width={width}
      height={height}
      borderRadius={borderRadius}
      displacementScale={displacementScale}
      bezelWidth={bezelWidth}
      shadowIntensity={shadowIntensity}
      blur={blur}
      saturation={saturation}
      tint={tint}
      tintFallback={tintFallback}
      refractionStrength={refractionStrength}
      showSpecular={showSpecular}
      specularAngle={specularAngle}
      specularTopOpacity={specularTopOpacity}
      specularEdgeOpacity={specularEdgeOpacity}
      innerTopHighlight={innerTopHighlight}
      innerBottomShadow={innerBottomShadow}
      borderColor={borderColor}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        fontFamily: 'inherit',
        color,
        fontSize,
        fontWeight,
        letterSpacing: '-0.01em',
        padding: '0 1.25rem',
        WebkitTapHighlightColor: 'transparent',
        ...style,
      }}
      {...buttonProps}
    >
      {children}
    </LiquidGlass>
  );
}
