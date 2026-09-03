import { getContext, setContext } from 'svelte';
import {
  createTranslator,
  defaultMessages,
  isRtlLocale,
  type Locale,
  type MessageKey,
  type Messages,
} from '@larose-ui/runtime-core';

export interface I18nContextValue {
  locale: Locale;
  dir: 'ltr' | 'rtl';
  t: (key: MessageKey, params?: Record<string, string | number>) => string;
}

export const I18N_CONTEXT = 'larose-i18n';

export function createI18nValue(
  locale: Locale = 'en',
  messages?: Partial<Record<Locale, Partial<Messages>>>,
): I18nContextValue {
  const merged = { ...defaultMessages };
  if (messages) {
    for (const loc of Object.keys(messages) as Locale[]) {
      merged[loc] = { ...merged[loc], ...messages[loc] };
    }
  }
  return {
    locale,
    dir: isRtlLocale(locale) ? 'rtl' : 'ltr',
    t: createTranslator(locale, merged),
  };
}

export function setI18nContext(value: I18nContextValue): void {
  setContext(I18N_CONTEXT, value);
}

export function getI18n(): I18nContextValue {
  try {
    return getContext<I18nContextValue | undefined>(I18N_CONTEXT) ?? createI18nValue('en');
  } catch {
    return createI18nValue('en');
  }
}
