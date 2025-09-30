'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function AboutTabs() {
  const pathname = usePathname()

  const tabs = [
    { label: 'About Us', href: '/about' as const },
    { label: 'About Ashram', href: '/about/ashram' as const },
    { label: 'About Sant Kabir', href: '/about/sant-kabir' as const },
  ] as const

  return (
    <div className="bg-white border-b border-cream-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-center overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`
                  px-6 py-4 font-semibold text-sm md:text-base whitespace-nowrap transition-colors duration-200
                  border-b-2
                  ${
                    isActive
                      ? 'border-teal-600 text-teal-600'
                      : 'border-transparent text-dark-700 hover:text-dark-900 hover:border-dark-300'
                  }
                `}
              >
                {tab.label}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}