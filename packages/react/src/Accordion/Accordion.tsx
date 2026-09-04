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
import { Collapse } from '../Motion/Collapse';
import styles from '@larose-ui/styles/components/Accordion/Accordion.module.css';

interface AccordionContextValue {
  type: 'single' | 'multiple';
  collapsible: boolean;
  openItems: Set<string>;
  toggleItem: (value: string) => void;
  baseId: string;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);
const AccordionItemContext = createContext<string | null>(null);

function useAccordionContext(component: string): AccordionContextValue {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error(`${component} must be used within Accordion`);
  }
  return context;
}

function useAccordionItemContext(component: string): string {
  const value = useContext(AccordionItemContext);
  if (!value) {
    throw new Error(`${component} must be used within AccordionItem`);
  }
  return value;
}

export interface AccordionProps {
  type?: 'single' | 'multiple';
  collapsible?: boolean;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function Accordion({
  type = 'single',
  collapsible = false,
  value,
  defaultValue = [],
  onValueChange,
  children,
  className,
  style,
}: AccordionProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const openItems = useMemo(
    () => new Set(isControlled ? value : internalValue),
    [internalValue, isControlled, value],
  );
  const baseId = useId();

  const toggleItem = useCallback(
    (itemValue: string) => {
      const next = new Set(openItems);
      const isOpen = next.has(itemValue);

      if (type === 'single') {
        next.clear();
        if (!isOpen || !collapsible) {
          next.add(itemValue);
        }
      } else if (isOpen) {
        next.delete(itemValue);
      } else {
        next.add(itemValue);
      }

      const nextValue = Array.from(next);
      if (!isControlled) setInternalValue(nextValue);
      onValueChange?.(nextValue);
    },
    [collapsible, isControlled, onValueChange, openItems, type],
  );

  const context = useMemo(
    () => ({
      type,
      collapsible,
      openItems,
      toggleItem,
      baseId,
    }),
    [baseId, collapsible, openItems, toggleItem, type],
  );

  return (
    <AccordionContext.Provider value={context}>
      <div className={[styles.accordion, className].filter(Boolean).join(' ')} style={style}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

export interface AccordionItemProps {
  value: string;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function AccordionItem({ value, children, disabled, className, style }: AccordionItemProps) {
  return (
    <AccordionItemContext.Provider value={value}>
      <div
        className={[styles.item, className].filter(Boolean).join(' ')}
        style={style}
        data-disabled={disabled ? 'true' : undefined}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

export interface AccordionTriggerProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function AccordionTrigger({ children, className, style }: AccordionTriggerProps) {
  const itemValue = useAccordionItemContext('AccordionTrigger');
  const { openItems, toggleItem, baseId } = useAccordionContext('AccordionTrigger');
  const isOpen = openItems.has(itemValue);
  const triggerId = `${baseId}-trigger-${itemValue}`;
  const panelId = `${baseId}-panel-${itemValue}`;

  return (
    <button
      type="button"
      id={triggerId}
      className={[styles.trigger, className].filter(Boolean).join(' ')}
      style={style}
      aria-expanded={isOpen}
      aria-controls={panelId}
      data-state={isOpen ? 'open' : 'closed'}
      onClick={() => toggleItem(itemValue)}
    >
      <span>{children}</span>
      <span className={styles.icon} aria-hidden="true">
        ▾
      </span>
    </button>
  );
}

export interface AccordionContentProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function AccordionContent({ children, className, style }: AccordionContentProps) {
  const itemValue = useAccordionItemContext('AccordionContent');
  const { openItems, baseId } = useAccordionContext('AccordionContent');
  const isOpen = openItems.has(itemValue);
  const triggerId = `${baseId}-trigger-${itemValue}`;
  const panelId = `${baseId}-panel-${itemValue}`;

  return (
    <Collapse open={isOpen}>
      <div
        id={panelId}
        role="region"
        className={[styles.content, className].filter(Boolean).join(' ')}
        style={style}
        aria-labelledby={triggerId}
        data-state={isOpen ? 'open' : 'closed'}
      >
        {children}
      </div>
    </Collapse>
  );
}
