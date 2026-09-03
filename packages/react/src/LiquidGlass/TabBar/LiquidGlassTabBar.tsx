import {
  useCallback,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { LIQUID_GLASS_PRESETS } from '../engine/defaults';
import type { LiquidGlassOptics } from '../engine/types';
import { LiquidGlass } from '../core/LiquidGlass';

// ─── Public types ─────────────────────────────────────────────────────────────

export interface LiquidGlassTabItem {
  key: string;
  label?: string;
  icon: ReactNode;
  badge?: number | string;
  ariaLabel?: string;
  disabled?: boolean;
}

export interface LiquidGlassTabBarProps extends LiquidGlassOptics {
  items: LiquidGlassTabItem[];
  activeKey?: string;
  defaultActiveKey?: string;
  onChange?: (key: string) => void;
  height?: number;
  borderRadius?: number;
  maxWidth?: number;
  indicatorPadding?: number;
  showIndicator?: boolean;
  indicatorBackground?: string;
  indicatorBorderColor?: string;
  activeColor?: string;
  inactiveColor?: string;
  position?: 'fixed' | 'absolute' | 'relative' | 'static';
  bottom?: number | string;
  className?: string;
  style?: CSSProperties;
}

/**
 * iOS-style liquid glass bottom tab bar built on the shared {@link LiquidGlass} surface.
 */
export function LiquidGlassTabBar({
  items,
  activeKey: controlledActiveKey,
  defaultActiveKey,
  onChange,
  height = 64,
  borderRadius = LIQUID_GLASS_PRESETS.tabBar.borderRadius,
  maxWidth = 420,
  indicatorPadding = 8,
  showIndicator = true,
  indicatorBackground = 'rgba(255, 255, 255, 0.16)',
  indicatorBorderColor = 'rgba(255, 255, 255, 0.28)',
  activeColor = '#ffffff',
  inactiveColor = 'rgba(255, 255, 255, 0.55)',
  position = 'fixed',
  bottom = 22,
  className,
  style,
  ...optics
}: LiquidGlassTabBarProps) {
  const [internalActiveKey, setInternalActiveKey] = useState(
    () => defaultActiveKey ?? items[0]?.key ?? '',
  );
  const activeKey = controlledActiveKey ?? internalActiveKey;
  const activeIndex = items.findIndex((item) => item.key === activeKey);
  const itemCount = items.length;

  const handleTabClick = useCallback(
    (key: string, disabled?: boolean) => {
      if (disabled) return;
      if (controlledActiveKey === undefined) setInternalActiveKey(key);
      onChange?.(key);
    },
    [controlledActiveKey, onChange],
  );

  const indicatorWidth = `calc((100% - ${indicatorPadding * 2}px) / ${itemCount})`;
  const indicatorTranslate =
    activeIndex >= 0 ? `translateX(${activeIndex * 100}%)` : 'none';

  const isPositioned = position === 'fixed' || position === 'absolute';

  return (
    <div
      style={{
        position,
        ...(isPositioned
          ? {
              left: 0,
              right: 0,
              bottom: typeof bottom === 'number' ? `${bottom}px` : bottom,
            }
          : undefined),
        display: 'flex',
        justifyContent: 'center',
        padding: isPositioned ? '0 20px' : undefined,
        zIndex: isPositioned ? 10 : undefined,
        pointerEvents: 'none',
      }}
    >
      <LiquidGlass
        as="nav"
        aria-label="Primary navigation"
        className={className}
        width="100%"
        maxWidth={maxWidth}
        height={height}
        borderRadius={borderRadius}
        displacementScale={optics.displacementScale ?? LIQUID_GLASS_PRESETS.tabBar.displacementScale}
        bezelWidth={optics.bezelWidth ?? LIQUID_GLASS_PRESETS.tabBar.bezelWidth}
        style={{ display: 'flex', alignItems: 'center', pointerEvents: 'auto', ...style }}
        {...optics}
      >
        {showIndicator && activeIndex >= 0 && (
          <div
            aria-hidden
            style={{
              position: 'absolute',
              top: indicatorPadding,
              bottom: indicatorPadding,
              left: indicatorPadding,
              width: indicatorWidth,
              borderRadius: 999,
              background: indicatorBackground,
              boxShadow: `inset 0 0 0 1px ${indicatorBorderColor}`,
              transition: 'transform 0.42s cubic-bezier(0.2, 0.9, 0.25, 1.15)',
              transform: indicatorTranslate,
              pointerEvents: 'none',
            }}
          />
        )}

        <div
          role="tablist"
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
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
                aria-label={item.ariaLabel ?? item.label ?? item.key}
                disabled={item.disabled}
                onClick={() => handleTabClick(item.key, item.disabled)}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: item.label ? 3 : 0,
                  background: 'none',
                  border: 'none',
                  color: isActive ? activeColor : inactiveColor,
                  padding: 0,
                  cursor: item.disabled ? 'not-allowed' : 'pointer',
                  WebkitTapHighlightColor: 'transparent',
                  opacity: item.disabled ? 0.4 : 1,
                  position: 'relative',
                  transition: 'color 0.28s ease',
                  fontFamily: 'inherit',
                }}
              >
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 24,
                    height: 24,
                    transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    transform: isActive ? 'translateY(-1px) scale(1.08)' : 'none',
                  }}
                >
                  {item.icon}
                </span>
                {item.label != null && (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: isActive ? 600 : 500,
                      letterSpacing: '0.01em',
                      lineHeight: 1,
                    }}
                  >
                    {item.label}
                  </span>
                )}
                {item.badge !== undefined && (
                  <span
                    aria-label={`${item.badge} notifications`}
                    style={{
                      position: 'absolute',
                      top: '14%',
                      right: '20%',
                      minWidth: 16,
                      height: 16,
                      borderRadius: 999,
                      background: '#ff3b30',
                      color: '#fff',
                      fontSize: 9.5,
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0 4px',
                      lineHeight: 1,
                      pointerEvents: 'none',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </LiquidGlass>
    </div>
  );
}
