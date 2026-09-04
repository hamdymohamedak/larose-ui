import { inject, provide, type InjectionKey, type Ref } from 'vue';

export interface AccordionContextValue {
  type: Ref<'single' | 'multiple'>;
  collapsible: Ref<boolean>;
  openItems: Ref<Set<string>>;
  toggleItem: (value: string) => void;
  baseId: string;
}

export const accordionKey: InjectionKey<AccordionContextValue> = Symbol('larose.accordion');
export const accordionItemKey: InjectionKey<string> = Symbol('larose.accordionItem');

export function provideAccordion(value: AccordionContextValue) {
  provide(accordionKey, value);
}

export function useAccordionContext(component: string): AccordionContextValue {
  const ctx = inject(accordionKey, null);
  if (!ctx) throw new Error(`${component} must be used within Accordion`);
  return ctx;
}

export function provideAccordionItem(value: string) {
  provide(accordionItemKey, value);
}

export function useAccordionItemContext(component: string): string {
  const value = inject(accordionItemKey, null);
  if (!value) throw new Error(`${component} must be used within AccordionItem`);
  return value;
}
