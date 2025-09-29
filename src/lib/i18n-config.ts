export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'hi', 'ne'],
} as const;

export type Locale = (typeof i18n)['locales'][number];

export const localeNames = {
  en: 'English',
  hi: 'हिंदी',
  ne: 'नेपाली'
} as const;

export const localeConfig = {
  en: {
    name: 'English',
    direction: 'ltr',
    dateFormat: 'MM/dd/yyyy',
  },
  hi: {
    name: 'हिंदी',
    direction: 'ltr',
    dateFormat: 'dd/MM/yyyy',
  },
  ne: {
    name: 'नेपाली',
    direction: 'ltr',
    dateFormat: 'yyyy/MM/dd',
  }
} as const;