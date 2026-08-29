export type Locale = 'en' | 'ar' | 'de';

export type MessageKey =
  | 'common.save'
  | 'common.cancel'
  | 'common.retry'
  | 'common.loading'
  | 'common.offline'
  | 'common.empty'
  | 'common.error'
  | 'common.unauthorized'
  | 'common.syncing'
  | 'common.synced'
  | 'network.offline.message'
  | 'network.slow.message'
  | 'environment.staging'
  | 'environment.demo'
  | 'environment.readonly'
  | 'environment.maintenance';

export type Messages = Record<MessageKey, string>;

const en: Messages = {
  'common.save': 'Save',
  'common.cancel': 'Cancel',
  'common.retry': 'Retry',
  'common.loading': 'Loading...',
  'common.offline': 'You are offline',
  'common.empty': 'No data found',
  'common.error': 'Something went wrong',
  'common.unauthorized': 'You do not have permission',
  'common.syncing': 'Syncing changes...',
  'common.synced': 'All changes synced',
  'network.offline.message': 'Changes will sync when you reconnect',
  'network.slow.message': 'Connection is slow. Loading optimized view.',
  'environment.staging': 'STAGING',
  'environment.demo': 'DEMO MODE',
  'environment.readonly': 'READ ONLY',
  'environment.maintenance': 'MAINTENANCE',
};

const ar: Messages = {
  'common.save': 'حفظ',
  'common.cancel': 'إلغاء',
  'common.retry': 'إعادة المحاولة',
  'common.loading': 'جاري التحميل...',
  'common.offline': 'أنت غير متصل',
  'common.empty': 'لا توجد بيانات',
  'common.error': 'حدث خطأ ما',
  'common.unauthorized': 'ليس لديك صلاحية',
  'common.syncing': 'جاري مزامنة التغييرات...',
  'common.synced': 'تمت مزامنة جميع التغييرات',
  'network.offline.message': 'سيتم مزامنة التغييرات عند إعادة الاتصال',
  'network.slow.message': 'الاتصال بطيء. جاري تحميل عرض محسّن.',
  'environment.staging': 'بيئة تجريبية',
  'environment.demo': 'وضع العرض',
  'environment.readonly': 'قراءة فقط',
  'environment.maintenance': 'صيانة',
};

const de: Messages = {
  'common.save': 'Speichern',
  'common.cancel': 'Abbrechen',
  'common.retry': 'Erneut versuchen',
  'common.loading': 'Wird geladen...',
  'common.offline': 'Sie sind offline',
  'common.empty': 'Keine Daten gefunden',
  'common.error': 'Etwas ist schiefgelaufen',
  'common.unauthorized': 'Sie haben keine Berechtigung',
  'common.syncing': 'Änderungen werden synchronisiert...',
  'common.synced': 'Alle Änderungen synchronisiert',
  'network.offline.message': 'Änderungen werden synchronisiert, sobald Sie wieder online sind',
  'network.slow.message': 'Verbindung ist langsam. Optimierte Ansicht wird geladen.',
  'environment.staging': 'STAGING',
  'environment.demo': 'DEMO-MODUS',
  'environment.readonly': 'NUR LESEN',
  'environment.maintenance': 'WARTUNG',
};

export const defaultMessages: Record<Locale, Messages> = { en, ar, de };

export const rtlLocales: Locale[] = ['ar'];

export function isRtlLocale(locale: Locale): boolean {
  return rtlLocales.includes(locale);
}

export function createTranslator(locale: Locale, messages = defaultMessages) {
  const catalog = messages[locale] ?? messages.en;
  return function t(key: MessageKey, params?: Record<string, string | number>): string {
    let text: string = catalog[key] ?? messages.en[key] ?? key;
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        text = text.replace(`{${k}}`, String(v));
      }
    }
    return text;
  };
}
