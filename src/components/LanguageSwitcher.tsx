'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { i18n, localeNames, type Locale } from '@/lib/i18n-config';

interface LanguageSwitcherProps {
  currentLocale: Locale;
}

export function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = (newLocale: Locale) => {
    // Remove current locale from pathname
    const segments = pathname.split('/');
    if (i18n.locales.includes(segments[1] as Locale)) {
      segments.splice(1, 1);
    }

    // Add new locale (if not default)
    const newPath = newLocale === i18n.defaultLocale
      ? segments.join('/')
      : `/${newLocale}${segments.join('/')}`;

    router.push((newPath || '/') as any);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 rounded-md hover:bg-gray-100 transition-colors"
        aria-label="Select language"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
        <span>{localeNames[currentLocale]}</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
          <div className="py-1">
            {i18n.locales.map((locale) => (
              <button
                key={locale}
                onClick={() => switchLanguage(locale)}
                className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                  currentLocale === locale
                    ? 'bg-teal-50 text-teal-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {localeNames[locale]}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}