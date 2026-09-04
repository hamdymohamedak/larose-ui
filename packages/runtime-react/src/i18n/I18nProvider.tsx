import { createContext, useContext, useMemo, type ReactNode } from 'react';
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

const I18nContext = createContext<I18nContextValue>({
  locale: 'en',
  dir: 'ltr',
  t: createTranslator('en'),
});

export function useI18n(): I18nContextValue {
  return useContext(I18nContext);
}

export interface I18nProviderProps {
  locale?: Locale;
  messages?: Partial<Record<Locale, Partial<Messages>>>;
  children: ReactNode;
}

export function I18nProvider({
  locale = 'en',
  messages,
  children,
}: I18nProviderProps) {
  const value = useMemo<I18nContextValue>(() => {
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
  }, [locale, messages]);

  return (
    <I18nContext.Provider value={value}>
      <div dir={value.dir} lang={locale}>
        {children}
      </div>
    </I18nContext.Provider>
  );
}
