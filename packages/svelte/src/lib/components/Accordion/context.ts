import { getContext, setContext } from 'svelte';

export interface AccordionContextValue {
  get type(): 'single' | 'multiple';
  get collapsible(): boolean;
  get openItems(): string[];
  toggleItem: (value: string) => void;
  baseId: string;
}

const accordionKey = Symbol('larose-accordion');
const accordionItemKey = Symbol('larose-accordion-item');

export function setAccordionContext(value: AccordionContextValue): void {
  setContext(accordionKey, value);
}

export function getAccordionContext(component: string): AccordionContextValue {
  const context = getContext<AccordionContextValue>(accordionKey);
  if (!context) {
    throw new Error(`${component} must be used within Accordion`);
  }
  return context;
}

export function setAccordionItemContext(value: string): void {
  setContext(accordionItemKey, value);
}

export function getAccordionItemContext(component: string): string {
  const value = getContext<string>(accordionItemKey);
  if (!value) {
    throw new Error(`${component} must be used within AccordionItem`);
  }
  return value;
}
