import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type RefObject,
} from 'react';
import { getSpringPreset, stepSpring, isSpringSettled, detectA11yPreferences } from '@larose-ui/core';
import {
  isLiquidGlassEnabled,
  liquidGlassOpticalKey,
  resolveLiquidGlassLens,
  type LiquidGlassProps,
} from '@larose-ui/glass';
import { useGlassLensOverlay } from '@larose-ui/glass/react';
import type { TabBarItemProps, TabBarListProps, TabBarPanelProps, TabBarProps } from './types';
import { formatTabBarBadge, resolveTabBarPlacement, warnIfTooManyTabs } from './utils';
import styles from '@larose-ui/styles/components/TabBar/TabBar.module.css';

interface TabBarContextValue {
  value: string;
  onValueChange: (value: string) => void;
  baseId: string;
  platform: NonNullable<TabBarProps['platform']>;
  liquidGlass: boolean | LiquidGlassProps;
}

const TabBarContext = createContext<TabBarContextValue | null>(null);

function useTabBarContext(name: string): TabBarContextValue {
  const context = useContext(TabBarContext);
  if (!context) throw new Error(`${name} must be used within TabBar`);
  return context;
}

function SearchTabIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1.375rem" height="1.375rem" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.75" />
      <path d="M16 16l4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

const TAB_INDICATOR_FALLBACK = { width: 80, height: 36, borderRadius: 18 };

interface LiquidGlassTabIndicatorProps {
  shellRef: RefObject<HTMLDivElement | null>;
  activeValue: string;
  platform: NonNullable<TabBarProps['platform']>;
  liquidGlass: boolean | LiquidGlassProps;
}

/** Displacement-mapped selection lens — reuses map during spring animation via setBounds. */
function LiquidGlassTabIndicator({
  shellRef,
  activeValue,
  platform,
  liquidGlass,
}: LiquidGlassTabIndicatorProps) {
  const rafRef = useRef(0);
  const springX = useRef({ value: 0, velocity: 0 });
  const springY = useRef({ value: 0, velocity: 0 });
  const springW = useRef({ value: 80, velocity: 0 });
  const springH = useRef({ value: 36, velocity: 0 });
  const initialised = useRef(false);
  const reducedMotion = detectA11yPreferences().reducedMotion;
  const isVertical = platform === 'visionos';

  const glassKey =
    liquidGlass === true
      ? 'default'
      : liquidGlass === false
        ? 'off'
        : liquidGlassOpticalKey(liquidGlass);

  const baseLens = useMemo(
    () => resolveLiquidGlassLens(TAB_INDICATOR_FALLBACK, liquidGlass),
    [glassKey, liquidGlass],
  );

  const { lensRef, setBounds, updateLens } = useGlassLensOverlay({ lens: baseLens });
  const lastLensSize = useRef({ width: 0, height: 0 });

  const syncLensGeometry = useCallback(
    (width: number, height: number) => {
      if (
        width === lastLensSize.current.width &&
        height === lastLensSize.current.height
      ) {
        return;
      }
      lastLensSize.current = { width, height };
      updateLens(
        resolveLiquidGlassLens(
          { width, height, borderRadius: height / 2 },
          liquidGlass,
        ),
      );
    },
    [liquidGlass, updateLens],
  );

  const measureActive = useCallback((): { x: number; y: number; width: number; height: number } | null => {
    const shell = shellRef.current;
    if (!shell) return null;

    const activeTab = shell.querySelector<HTMLElement>(`[data-tab-value="${activeValue}"]`);
    if (!activeTab) return null;

    const shellRect = shell.getBoundingClientRect();
    const tabRect = activeTab.getBoundingClientRect();

    const bounds = {
      x: tabRect.left - shellRect.left,
      y: tabRect.top - shellRect.top,
      width: tabRect.width,
      height: tabRect.height,
    };

    syncLensGeometry(bounds.width, bounds.height);

    return bounds;
  }, [activeValue, shellRef, syncLensGeometry]);

  useEffect(() => {
    lastLensSize.current = { width: 0, height: 0 };
    updateLens(baseLens);
  }, [baseLens, updateLens]);

  useLayoutEffect(() => {
    const m = measureActive();
    if (!m) return;

    if (!initialised.current) {
      springX.current = { value: m.x, velocity: 0 };
      springY.current = { value: m.y, velocity: 0 };
      springW.current = { value: m.width, velocity: 0 };
      springH.current = { value: m.height, velocity: 0 };
      initialised.current = true;
      setBounds(m);
      return;
    }

    if (reducedMotion) {
      setBounds(m);
      return;
    }

    const config = getSpringPreset('snappy');
    const targetX = m.x;
    const targetY = m.y;
    const targetW = m.width;
    const targetH = m.height;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.032);
      last = now;

      if (isVertical) {
        springY.current = stepSpring(springY.current, targetY, config, dt);
        springH.current = stepSpring(springH.current, targetH, config, dt);
        setBounds({
          x: targetX,
          y: springY.current.value,
          width: targetW,
          height: springH.current.value,
        });
        if (
          !isSpringSettled(springY.current, targetY) ||
          !isSpringSettled(springH.current, targetH)
        ) {
          rafRef.current = requestAnimationFrame(tick);
        }
      } else {
        springX.current = stepSpring(springX.current, targetX, config, dt);
        springW.current = stepSpring(springW.current, targetW, config, dt);
        setBounds({
          x: springX.current.value,
          y: targetY,
          width: springW.current.value,
          height: targetH,
        });
        if (
          !isSpringSettled(springX.current, targetX) ||
          !isSpringSettled(springW.current, targetW)
        ) {
          rafRef.current = requestAnimationFrame(tick);
        }
      }
    };

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [activeValue, isVertical, measureActive, reducedMotion, setBounds]);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell || typeof ResizeObserver === 'undefined') return undefined;

    const sync = () => {
      const m = measureActive();
      if (m) setBounds(m);
    };

    const observer = new ResizeObserver(sync);
    observer.observe(shell);
    window.addEventListener('resize', sync);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', sync);
    };
  }, [measureActive, setBounds, shellRef]);

  return (
    <div
      ref={lensRef}
      className={styles.liquidGlassIndicator}
      aria-hidden="true"
      data-larose-glass-lens=""
    />
  );
}

export function TabBarList({ children }: TabBarListProps) {
  const { platform, liquidGlass, value } = useTabBarContext('TabBarList');
  const shellRef = useRef<HTMLDivElement>(null);
  const glassOn = isLiquidGlassEnabled(liquidGlass);

  return (
    <div
      ref={shellRef}
      className={styles.listShell}
      data-liquid-glass={glassOn ? 'true' : undefined}
      data-platform={platform}
    >
      {glassOn && (
        <LiquidGlassTabIndicator
          shellRef={shellRef}
          activeValue={value}
          platform={platform}
          liquidGlass={liquidGlass}
        />
      )}
      <ul
        className={styles.list}
        role="tablist"
        data-platform={platform}
        data-liquid-glass={liquidGlass ? 'true' : undefined}
      >
        {children}
      </ul>
    </div>
  );
}

export function TabBarItem({ value, label, icon, badge, disabled }: TabBarItemProps) {
  const { value: active, onValueChange, baseId, platform } = useTabBarContext('TabBarItem');
  const selected = active === value;
  const tabId = `${baseId}-tab-${value}`;
  const panelId = `${baseId}-panel-${value}`;
  const badgeLabel = formatTabBarBadge(badge);

  return (
    <li role="presentation">
      <button
        type="button"
        id={tabId}
        role="tab"
        className={styles.tab}
        data-tab-value={value}
        data-selected={selected ? 'true' : undefined}
        aria-selected={selected}
        aria-controls={panelId}
        tabIndex={selected ? 0 : -1}
        disabled={disabled}
        onClick={() => onValueChange(value)}
      >
        {icon && <span className={styles.icon}>{icon}</span>}
        <span>{label}</span>
        {badgeLabel && (
          <span className={styles.badge} aria-label={`${badgeLabel} notifications`}>
            {badgeLabel}
          </span>
        )}
        {platform === 'visionos' && selected && <span className="sr-only">{label}</span>}
      </button>
    </li>
  );
}

export function TabBarPanel({ value, children }: TabBarPanelProps) {
  const { value: active, baseId } = useTabBarContext('TabBarPanel');
  if (active !== value) return null;
  const tabId = `${baseId}-tab-${value}`;
  const panelId = `${baseId}-panel-${value}`;

  return (
    <div id={panelId} role="tabpanel" className={styles.panel} aria-labelledby={tabId} tabIndex={0}>
      {children}
    </div>
  );
}

/**
 * Tab bar for top-level app navigation (iOS, iPadOS, visionOS).
 * @see https://developer.apple.com/design/human-interface-guidelines/tab-bars
 */
export function TabBar({
  value,
  defaultValue = '',
  onValueChange,
  platform = 'ios',
  variant = 'tabBarOnly',
  liquidGlass = false,
  searchTab,
  className,
  children,
  'aria-label': ariaLabel = 'Tab bar',
}: TabBarProps) {
  const [internal, setInternal] = useState(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;
  const baseId = useId();
  const placement = resolveTabBarPlacement(platform);

  const childArray = Children.toArray(children);
  const list = childArray.find(
    (child): child is ReactElement<TabBarListProps> => isValidElement(child) && child.type === TabBarList,
  );
  const panels = childArray.filter(
    (child): child is ReactElement<TabBarPanelProps> => isValidElement(child) && child.type === TabBarPanel,
  );

  useEffect(() => {
    if (!list) return;
    const count = Children.toArray(list.props.children).filter(isValidElement).length + (searchTab ? 1 : 0);
    warnIfTooManyTabs(count);
  }, [list, searchTab]);

  const handleChange = useCallback(
    (next: string) => {
      if (!isControlled) setInternal(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  const context = useMemo(
    () => ({ value: current, onValueChange: handleChange, baseId, platform, liquidGlass }),
    [baseId, current, handleChange, liquidGlass, platform],
  );

  return (
    <TabBarContext.Provider value={context}>
      <div
        className={[styles.tabBar, className].filter(Boolean).join(' ')}
        data-platform={platform}
        data-variant={variant}
        data-placement={placement}
        data-liquid-glass={isLiquidGlassEnabled(liquidGlass) ? 'true' : undefined}
        aria-label={ariaLabel}
      >
        <div
          className={styles.layout}
          data-platform={platform}
          data-liquid-glass={isLiquidGlassEnabled(liquidGlass) ? 'true' : undefined}
        >
          {list &&
            cloneElement(
              list,
              {},
              <>
                {list.props.children}
                {searchTab && (
                  <li role="presentation">
                    <button
                      type="button"
                      role="tab"
                      className={[styles.tab, styles.searchTab].join(' ')}
                      data-tab-value="__search__"
                      data-style={searchTab.style ?? 'standard'}
                      data-selected={current === '__search__' ? 'true' : undefined}
                      aria-selected={current === '__search__'}
                      aria-label={searchTab.label ?? 'Search'}
                      onClick={() => handleChange('__search__')}
                    >
                      <span className={styles.icon}>{searchTab.icon ?? <SearchTabIcon />}</span>
                      {(searchTab.style ?? 'standard') === 'standard' && (
                        <span>{searchTab.label ?? 'Search'}</span>
                      )}
                    </button>
                  </li>
                )}
              </>,
            )}
          <div className={styles.content}>{panels}</div>
        </div>
      </div>
    </TabBarContext.Provider>
  );
}

export type { TabBarProps, TabBarItemProps, TabBarListProps, TabBarPanelProps } from './types';
export { MAX_TAB_BAR_ITEMS, formatTabBarBadge, warnIfTooManyTabs } from './utils';
