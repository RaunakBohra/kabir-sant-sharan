'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { type Locale, locales, localeNames, defaultLocale, getLocaleFromUrl, addLocaleToUrl, removeLocaleFromUrl } from '@/i18n'

interface LanguageSwitcherProps {
  variant?: 'dropdown' | 'tabs' | 'minimal'
  className?: string
}

export function LanguageSwitcher({ variant = 'dropdown', className = '' }: LanguageSwitcherProps) {
  const router = useRouter()
  const pathname = usePathname()
  const currentLocale = getLocaleFromUrl(pathname)
  const [isOpen, setIsOpen] = useState(false)

  const handleLanguageChange = (locale: Locale) => {
    const currentPath = removeLocaleFromUrl(pathname)
    const newPath = addLocaleToUrl(currentPath, locale)

    router.push(newPath as any)
    setIsOpen(false)
  }

  if (variant === 'minimal') {
    return (
      <div className={`flex items-center space-x-1 ${className}`}>
        {locales.map((locale) => (
          <button
            key={locale}
            onClick={() => handleLanguageChange(locale)}
            className={`px-2 py-1 text-xs font-medium rounded transition-colors duration-200 ${
              currentLocale === locale
                ? 'bg-dark-900 text-cream-50'
                : 'text-dark-600 hover:text-dark-900 hover:bg-cream-100'
            }`}
            title={localeNames[locale]}
          >
            {locale.toUpperCase()}
          </button>
        ))}
      </div>
    )
  }

  if (variant === 'tabs') {
    return (
      <div className={`inline-flex bg-cream-100 rounded-lg p-1 ${className}`}>
        {locales.map((locale) => (
          <button
            key={locale}
            onClick={() => handleLanguageChange(locale)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              currentLocale === locale
                ? 'bg-dark-900 text-cream-50 shadow-sm'
                : 'text-dark-600 hover:text-dark-900 hover:bg-cream-200'
            }`}
          >
            {localeNames[locale]}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-3 py-2 border border-cream-300 rounded-lg bg-cream-50 text-dark-800 text-sm font-medium hover:bg-cream-100 focus:outline-none focus:ring-2 focus:ring-dark-600 focus:ring-offset-2 focus:ring-offset-cream-50 transition-colors duration-200"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
        {localeNames[currentLocale]}
        <svg
          className={`w-4 h-4 ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-cream-50 rounded-lg shadow-xl border border-cream-200 z-50">
          <div className="p-2">
            <div className="text-xs font-medium text-dark-600 px-3 py-2 border-b border-cream-200 mb-1">
              Choose Language
            </div>
            {locales.map((locale) => (
              <button
                key={locale}
                onClick={() => handleLanguageChange(locale)}
                className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors duration-200 ${
                  currentLocale === locale
                    ? 'bg-dark-900 text-cream-50'
                    : 'text-dark-800 hover:bg-cream-100'
                }`}
                role="option"
                aria-selected={currentLocale === locale}
              >
                <div className="flex items-center">
                  <span className="font-medium">{localeNames[locale]}</span>
                  <span className="ml-2 text-xs opacity-60">({locale.toUpperCase()})</span>
                </div>
                {currentLocale === locale && (
                  <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>

          {/* Language Info */}
          <div className="px-3 py-2 border-t border-cream-200 bg-cream-100 rounded-b-lg">
            <div className="text-xs text-dark-600">
              <div className="flex items-center mb-1">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Current: {localeNames[currentLocale]}</span>
              </div>
              <p className="text-xs">
                Language settings apply to all content and navigation.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

// Compact version for mobile/header use
export function MobileLanguageSwitcher({ className = '' }: { className?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const currentLocale = getLocaleFromUrl(pathname)

  const handleLanguageChange = (locale: Locale) => {
    const currentPath = removeLocaleFromUrl(pathname)
    const newPath = addLocaleToUrl(currentPath, locale)
    router.push(newPath as any)
  }

  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-dark-800">Language</span>
        <span className="text-xs text-dark-600">{localeNames[currentLocale]}</span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {locales.map((locale) => (
          <button
            key={locale}
            onClick={() => handleLanguageChange(locale)}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              currentLocale === locale
                ? 'bg-dark-900 text-cream-50'
                : 'bg-cream-100 text-dark-700 hover:bg-cream-200'
            }`}
          >
            <div className="text-center">
              <div className="font-medium">{locale.toUpperCase()}</div>
              <div className="text-xs opacity-75">{localeNames[locale]}</div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-3 text-xs text-dark-600 text-center">
        Language preference is saved automatically
      </div>
    </div>
  )
}

// Hook for getting current locale in components
export function useCurrentLocale(): Locale {
  const pathname = usePathname()
  return getLocaleFromUrl(pathname)
}

// Language badge component for showing current language
export function LanguageBadge({ className = '' }: { className?: string }) {
  const currentLocale = useCurrentLocale()

  return (
    <div className={`inline-flex items-center px-2 py-1 bg-dark-100 text-dark-700 text-xs font-medium rounded-full ${className}`}>
      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
      </svg>
      {localeNames[currentLocale]}
    </div>
  )
}