import {
  useCallback,
  useState,
  type ReactNode,
} from 'react';
import { LIQUID_GLASS_PRESETS } from '../engine/defaults';
import type { LiquidGlassChromeProps, LiquidGlassOptics } from '../engine/types';
import { LiquidGlass } from '../core/LiquidGlass';

export interface LiquidGlassTopBarItem {
  key: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  ariaLabel?: string;
}

export type LiquidGlassTopBarVariant = 'floating' | 'edge';

export interface LiquidGlassTopBarProps
  extends LiquidGlassOptics, LiquidGlassChromeProps {
  title?: ReactNode;
  logo?: ReactNode;
  items?: LiquidGlassTopBarItem[];
  activeKey?: string;
  defaultActiveKey?: string;
  onChange?: (key: string) => void;
  trailing?: ReactNode;
  /**
   * `floating` — inset pill bar with rounded corners (modern macOS/iOS style).
   * `edge` — full-bleed bar flush with the viewport top.
   * @default 'floating'
   */
  variant?: LiquidGlassTopBarVariant;
  height?: number;
  borderRadius?: number;
  paddingX?: number;
  activeColor?: string;
  inactiveColor?: string;
  titleColor?: string;
  /** Background of the segmented nav track. */
  navTrackBackground?: string;
  /** Active nav pill background. */
  navActiveBackground?: string;
  position?: 'fixed' | 'absolute' | 'relative' | 'sticky' | 'static';
  top?: number | string;
  insetX?: number;
}

/**
 * Top navigation bar with liquid glass refraction.
 * Uses a three-zone grid so logo, nav, and actions stay vertically centred.
 */
export function LiquidGlassTopBar({
  title,
  logo,
  items = [],
  activeKey: controlledActiveKey,
  defaultActiveKey,
  onChange,
  trailing,
  variant = 'floating',
  height = 56,
  borderRadius: borderRadiusProp,
  paddingX = 16,
  activeColor = '#ffffff',
  inactiveColor = 'rgba(255, 255, 255, 0.62)',
  titleColor = '#ffffff',
  navTrackBackground = 'rgba(255, 255, 255, 0.08)',
  navActiveBackground = 'rgba(255, 255, 255, 0.18)',
  position = 'fixed',
  top: topProp,
  insetX: insetXProp,
  className,
  style,
  specularAngle = LIQUID_GLASS_PRESETS.topBar.specularAngle,
  displacementScale = LIQUID_GLASS_PRESETS.topBar.displacementScale,
  bezelWidth = LIQUID_GLASS_PRESETS.topBar.bezelWidth,
  innerBottomShadow = 0.12,
  ...optics
}: LiquidGlassTopBarProps) {
  const isFloating = variant === 'floating';
  const insetX = insetXProp ?? (isFloating ? 16 : 0);
  const top = topProp ?? (isFloating ? 14 : 0);
  const borderRadius =
    borderRadiusProp ?? (isFloating ? LIQUID_GLASS_PRESETS.topBar.borderRadius : 0);

  const [internalActiveKey, setInternalActiveKey] = useState(
    () => defaultActiveKey ?? items[0]?.key ?? '',
  );
  const activeKey = controlledActiveKey ?? internalActiveKey;

  const handleNavClick = useCallback(
    (key: string, disabled?: boolean) => {
      if (disabled) return;
      if (controlledActiveKey === undefined) setInternalActiveKey(key);
      onChange?.(key);
    },
    [controlledActiveKey, onChange],
  );

  const isPositioned =
    position === 'fixed' || position === 'absolute' || position === 'sticky';

  return (
    <div
      style={{
        position,
        ...(isPositioned
          ? {
              top: typeof top === 'number' ? `${top}px` : top,
              left: insetX,
              right: insetX,
              zIndex: 20,
            }
          : undefined),
        pointerEvents: 'none',
      }}
    >
      <LiquidGlass
        as="header"
        aria-label="Top navigation"
        className={className}
        width="100%"
        height={height}
        borderRadius={borderRadius}
        specularAngle={specularAngle}
        displacementScale={displacementScale}
        bezelWidth={bezelWidth}
        innerBottomShadow={innerBottomShadow}
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          padding: `0 ${paddingX}px`,
          pointerEvents: 'auto',
          ...style,
        }}
        {...optics}
      >
        {/* Leading — logo / title */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            minWidth: 0,
            justifySelf: 'start',
          }}
        >
          {logo && (
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {logo}
            </span>
          )}
          {title && (
            <span
              style={{
                color: titleColor,
                fontWeight: 700,
                fontSize: '1.0625rem',
                letterSpacing: '-0.03em',
                lineHeight: 1,
                whiteSpace: 'nowrap',
              }}
            >
              {title}
            </span>
          )}
        </div>

        {/* Centre — segmented nav track */}
        {items.length > 0 && (
          <nav
            role="tablist"
            aria-label="Sections"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifySelf: 'center',
              gap: 2,
              padding: 3,
              borderRadius: 999,
              background: navTrackBackground,
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.10)',
            }}
          >
            {items.map((item) => {
              const isActive = item.key === activeKey;
              return (
                <button
                  key={item.key}
                  role="tab"
                  type="button"
                  aria-selected={isActive}
                  aria-label={item.ariaLabel ?? item.label}
                  disabled={item.disabled}
                  onClick={() => handleNavClick(item.key, item.disabled)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    height: 32,
                    padding: '0 16px',
                    borderRadius: 999,
                    border: 'none',
                    background: isActive ? navActiveBackground : 'transparent',
                    boxShadow: isActive
                      ? 'inset 0 0 0 1px rgba(255,255,255,0.22), 0 1px 4px rgba(0,0,0,0.12)'
                      : 'none',
                    color: isActive ? activeColor : inactiveColor,
                    fontSize: '0.8125rem',
                    fontWeight: isActive ? 600 : 500,
                    letterSpacing: '-0.01em',
                    lineHeight: 1,
                    cursor: item.disabled ? 'not-allowed' : 'pointer',
                    opacity: item.disabled ? 0.4 : 1,
                    fontFamily: 'inherit',
                    transition:
                      'background 0.22s cubic-bezier(0.2, 0.9, 0.25, 1.1), color 0.22s ease, box-shadow 0.22s ease, transform 0.22s ease',
                    transform: isActive ? 'scale(1)' : 'scale(0.98)',
                    WebkitTapHighlightColor: 'transparent',
                  }}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
            })}
          </nav>
        )}

        {/* Trailing — actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 8,
            minWidth: 0,
            justifySelf: 'end',
          }}
        >
          {trailing}
        </div>
      </LiquidGlass>
    </div>
  );
}
