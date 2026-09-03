import {
  createContext,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import styles from '@larose-ui/styles/components/Tabs/Tabs.module.css';

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
  baseId: string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext(component: string): TabsContextValue {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error(`${component} must be used within Tabs`);
  }
  return context;
}

export interface TabsProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function Tabs({
  value,
  defaultValue = '',
  onValueChange,
  children,
  className,
  style,
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;
  const baseId = useId();

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
    <TabsContext.Provider value={context}>
      <div className={[styles.tabs, className].filter(Boolean).join(' ')} style={style}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export interface TabsListProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  'aria-label'?: string;
}

export function TabsList({
  children,
  className,
  style,
  'aria-label': ariaLabel = 'Tabs',
}: TabsListProps) {
  return (
    <div
      className={[styles.list, className].filter(Boolean).join(' ')}
      style={style}
      role="tablist"
      aria-label={ariaLabel}
    >
      {children}
    </div>
  );
}

export interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function TabsTrigger({ value, children, disabled, className, style }: TabsTriggerProps) {
  const { value: activeValue, onValueChange, baseId } = useTabsContext('TabsTrigger');
  const selected = activeValue === value;
  const tabId = `${baseId}-tab-${value}`;
  const panelId = `${baseId}-panel-${value}`;

  return (
    <button
      type="button"
      id={tabId}
      role="tab"
      className={[styles.trigger, className].filter(Boolean).join(' ')}
      style={style}
      aria-selected={selected}
      aria-controls={panelId}
      tabIndex={selected ? 0 : -1}
      data-state={selected ? 'active' : 'inactive'}
      disabled={disabled}
      onClick={() => onValueChange(value)}
    >
      {children}
    </button>
  );
}

export interface TabsPanelProps {
  value: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function TabsPanel({ value, children, className, style }: TabsPanelProps) {
  const { value: activeValue, baseId } = useTabsContext('TabsPanel');
  const selected = activeValue === value;
  const tabId = `${baseId}-tab-${value}`;
  const panelId = `${baseId}-panel-${value}`;

  if (!selected) return null;

  return (
    <div
      id={panelId}
      role="tabpanel"
      className={[styles.panel, className].filter(Boolean).join(' ')}
      style={style}
      aria-labelledby={tabId}
      tabIndex={0}
    >
      {children}
    </div>
  );
}
