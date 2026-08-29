import { describe, expect, it } from 'vitest';
import { createTranslator, isRtlLocale } from './i18n/messages';

describe('i18n', () => {
  it('translates English keys', () => {
    const t = createTranslator('en');
    expect(t('common.save')).toBe('Save');
  });

  it('translates Arabic keys', () => {
    const t = createTranslator('ar');
    expect(t('common.save')).toBe('حفظ');
  });

  it('detects RTL locales', () => {
    expect(isRtlLocale('ar')).toBe(true);
    expect(isRtlLocale('en')).toBe(false);
  });
});

describe('createTranslator fallback', () => {
  it('falls back to English for unknown keys', () => {
    const t = createTranslator('de');
    expect(t('common.cancel')).toBe('Abbrechen');
  });
});
