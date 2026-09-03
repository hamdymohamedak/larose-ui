import {
  createElement,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type HTMLAttributes,
} from 'react';
import type { LiquidGlassSurfaceProps } from '../engine/types';
import { useLiquidGlass } from './useLiquidGlass';
import { splitLiquidGlassLayoutStyle } from './splitLayoutStyle';

type LiquidGlassElementProps = LiquidGlassSurfaceProps &
  Omit<HTMLAttributes<HTMLElement>, 'style' | 'children'> &
  Partial<Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'disabled'>>;

/**
 * Base liquid glass surface — SVG displacement refraction on Chromium,
 * frosted blur fallback elsewhere. All optical props are exposed for tuning.
 */
export function LiquidGlass({
  children,
  className,
  style,
  as = 'div',
  width,
  height,
  minWidth,
  maxWidth,
  minHeight,
  maxHeight,
  borderRadius = 30,
  onDisplacementMapChange,
  'aria-label': ariaLabel,
  blur,
  saturation,
  tint,
  tintFallback,
  displacementScale,
  bezelWidth,
  refractionStrength,
  showSpecular,
  specularAngle,
  specularTopOpacity,
  specularEdgeOpacity,
  innerTopHighlight,
  innerBottomShadow,
  shadowIntensity,
  borderColor,
  ...rest
}: LiquidGlassElementProps) {
  const opticsOverrides = {
    blur,
    saturation,
    tint,
    tintFallback,
    displacementScale,
    bezelWidth,
    refractionStrength,
    showSpecular,
    specularAngle,
    specularTopOpacity,
    specularEdgeOpacity,
    innerTopHighlight,
    innerBottomShadow,
    shadowIntensity,
    borderColor,
  };

  const {
    shellRef,
    filterId,
    mapDataUrl,
    supportsRefraction,
    optics,
    shellStyle,
  } = useLiquidGlass({
    borderRadius,
    onDisplacementMapChange,
    ...opticsOverrides,
  });

  const { shell: shellLayout, content: contentLayout } =
    splitLiquidGlassLayoutStyle(style);

  const geometryStyle: CSSProperties = {
    position: 'relative',
    width,
    height,
    minWidth,
    maxWidth,
    minHeight,
    maxHeight,
    borderRadius,
    boxSizing: 'border-box',
    ...shellStyle,
    ...shellLayout,
  };

  return (
    <>
      {supportsRefraction && (
        <svg
          aria-hidden
          focusable="false"
          width={0}
          height={0}
          style={{ position: 'absolute', overflow: 'hidden' }}
        >
          <defs>
            <filter
              id={filterId}
              x="-15%"
              y="-40%"
              width="130%"
              height="180%"
              colorInterpolationFilters="sRGB"
            >
              {mapDataUrl && (
                <feImage
                  href={mapDataUrl}
                  x="0"
                  y="0"
                  width="100%"
                  height="100%"
                  result="displacement_map"
                />
              )}
              <feDisplacementMap
                in="SourceGraphic"
                in2="displacement_map"
                scale={optics.displacementScale}
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>
        </svg>
      )}

      {createElement(
        as,
        {
          ref: shellRef,
          className,
          style: geometryStyle,
          'aria-label': ariaLabel,
          ...rest,
        },
        <>
          {optics.showSpecular && (
            <div
              aria-hidden
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 'inherit',
                padding: 1,
                background: `conic-gradient(
                  from ${optics.specularAngle}deg at 50% 0%,
                  rgba(255,255,255,${optics.specularTopOpacity}),
                  rgba(255,255,255,0) 30%,
                  rgba(255,255,255,0) 70%,
                  rgba(255,255,255,${optics.specularEdgeOpacity}) 100%
                )`,
                WebkitMask:
                  'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
                mixBlendMode: 'screen',
                pointerEvents: 'none',
              }}
            />
          )}

          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 'inherit',
              boxShadow: `inset 0 1px 0 rgba(255,255,255,${optics.innerTopHighlight}), inset 0 -6px 14px rgba(0,0,0,${optics.innerBottomShadow})`,
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              position: 'relative',
              zIndex: 1,
              width: '100%',
              height: '100%',
              boxSizing: 'border-box',
              ...contentLayout,
            }}
          >
            {children}
          </div>
        </>,
      )}
    </>
  );
}
