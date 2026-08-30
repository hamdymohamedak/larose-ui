import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
  type ReactElement,
} from 'react';
import type { TabBarItemProps, TabBarListProps, TabBarPanelProps, TabBarProps } from './types';
import { formatTabBarBadge, resolveTabBarPlacement, warnIfTooManyTabs } from './utils';
import styles from './TabBar.module.css';

interface TabBarContextValue {
  value: string;
  onValueChange: (value: string) => void;
  baseId: string;
  platform: NonNullable<TabBarProps['platform']>;
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

export function TabBarList({ children }: TabBarListProps) {
  const { platform } = useTabBarContext('TabBarList');
  return (
    <ul className={styles.list} role="tablist" data-platform={platform}>
      {children}
    </ul>
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
    () => ({ value: current, onValueChange: handleChange, baseId, platform }),
    [baseId, current, handleChange, platform],
  );

  return (
    <TabBarContext.Provider value={context}>
      <div
        className={[styles.tabBar, className].filter(Boolean).join(' ')}
        data-platform={platform}
        data-variant={variant}
        data-placement={placement}
        aria-label={ariaLabel}
      >
        <div className={styles.layout} data-platform={platform}>
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
