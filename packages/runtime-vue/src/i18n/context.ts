import { inject, provide, type InjectionKey, computed, type ComputedRef } from 'vue';
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

export const I18N_KEY: InjectionKey<ComputedRef<I18nContextValue>> = Symbol('larose-i18n');

export function provideI18n(
  locale: Locale = 'en',
  messages?: Partial<Record<Locale, Partial<Messages>>>,
): ComputedRef<I18nContextValue> {
  const value = computed<I18nContextValue>(() => {
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
  });
  provide(I18N_KEY, value);
  return value;
}

export function useI18n(): I18nContextValue {
  const injected = inject(I18N_KEY, null);
  if (injected) return injected.value;
  return {
    locale: 'en',
    dir: 'ltr',
    t: createTranslator('en'),
  };
}
