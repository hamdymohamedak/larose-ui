import {
  Children,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import type { TabViewVariant } from './types';
import { formatTabLabel, warnIfTooManyTabs } from './utils';
import styles from './TabView.module.css';

interface TabViewContextValue {
  value: string;
  onValueChange: (value: string) => void;
  baseId: string;
}

const TabViewContext = createContext<TabViewContextValue | null>(null);

function useTabViewContext(component: string): TabViewContextValue {
  const context = useContext(TabViewContext);
  if (!context) {
    throw new Error(`${component} must be used within TabView`);
  }
  return context;
}

export interface TabViewProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  variant?: TabViewVariant;
  showTabs?: boolean;
  inset?: boolean;
  children: ReactNode;
  className?: string;
  'aria-label'?: string;
}

export function TabView({
  value,
  defaultValue = '',
  onValueChange,
  variant = 'bordered',
  showTabs = true,
  inset = true,
  children,
  className,
  'aria-label': ariaLabel = 'Tab view',
}: TabViewProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;
  const baseId = useId();

  const childArray = Children.toArray(children);
  const tabList = childArray.find(
    (child): child is ReactElement<TabViewListProps> =>
      isValidElement(child) && child.type === TabViewList,
  );
  const panels = childArray.filter(
    (child): child is ReactElement<TabViewPanelProps> =>
      isValidElement(child) && child.type === TabViewPanel,
  );

  useEffect(() => {
    if (!tabList) return;
    const count = Children.toArray(tabList.props.children).filter(isValidElement).length;
    warnIfTooManyTabs(count);
  }, [tabList]);

  const handleChange = useCallback(
    (next: string) => {
      if (!isControlled) setInternalValue(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  const context = useMemo(
    () => ({
      value: currentValue,
      onValueChange: handleChange,
      baseId,
    }),
    [baseId, currentValue, handleChange],
  );

  return (
    <TabViewContext.Provider value={context}>
      <div
        className={[styles.tabView, className].filter(Boolean).join(' ')}
        data-variant={variant}
        data-inset={inset ? 'true' : undefined}
        aria-label={ariaLabel}
      >
        {showTabs && tabList}
        <div className={styles.content}>{panels}</div>
      </div>
    </TabViewContext.Provider>
  );
}

export interface TabViewListProps {
  children: ReactNode;
  'aria-label'?: string;
}

export function TabViewList({ children, 'aria-label': listLabel = 'Tabs' }: TabViewListProps) {
  return (
    <ul className={styles.tabList} role="tablist" aria-label={listLabel}>
      {children}
    </ul>
  );
}

export interface TabViewTabProps {
  value: string;
  label: string;
  disabled?: boolean;
}

export function TabViewTab({ value, label, disabled }: TabViewTabProps) {
  const { value: activeValue, onValueChange, baseId } = useTabViewContext('TabViewTab');
  const selected = activeValue === value;
  const tabId = `${baseId}-tab-${value}`;
  const panelId = `${baseId}-panel-${value}`;

  return (
    <li role="presentation">
      <button
        type="button"
        id={tabId}
        role="tab"
        className={styles.tab}
        aria-selected={selected}
        aria-controls={panelId}
        tabIndex={selected ? 0 : -1}
        data-selected={selected ? 'true' : undefined}
        disabled={disabled}
        onClick={() => onValueChange(value)}
      >
        {formatTabLabel(label)}
      </button>
    </li>
  );
}

export interface TabViewPanelProps {
  value: string;
  children: ReactNode;
}

export function TabViewPanel({ value, children }: TabViewPanelProps) {
  const { value: activeValue, baseId } = useTabViewContext('TabViewPanel');
  const selected = activeValue === value;
  const tabId = `${baseId}-tab-${value}`;
  const panelId = `${baseId}-panel-${value}`;

  if (!selected) return null;

  return (
    <div
      id={panelId}
      role="tabpanel"
      className={styles.panel}
      aria-labelledby={tabId}
      tabIndex={0}
    >
      {children}
    </div>
  );
}
