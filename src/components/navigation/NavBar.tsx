'use client'

import Link from 'next/link'
import { useState } from 'react'

interface NavItem {
  label: string
  href: string
  children?: NavItem[]
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'About Kabir',
    href: '/about',
    children: [
      { label: 'Life & Teachings', href: '/about/life-teachings' },
      { label: 'Philosophy', href: '/about/philosophy' },
      { label: 'Historical Context', href: '/about/history' },
    ]
  },
  {
    label: 'Teachings',
    href: '/teachings',
    children: [
      { label: 'Daily Wisdom', href: '/teachings/daily-wisdom' },
      { label: 'Dohas & Poetry', href: '/teachings/dohas' },
      { label: 'Spiritual Insights', href: '/teachings/insights' },
      { label: 'Community Stories', href: '/teachings/stories' },
    ]
  },
  {
    label: 'Events',
    href: '/events',
    children: [
      { label: 'Satsang Schedule', href: '/events/satsang' },
      { label: 'Festivals', href: '/events/festivals' },
      { label: 'Workshops', href: '/events/workshops' },
    ]
  },
  {
    label: 'Media',
    href: '/media',
    children: [
      { label: 'Audio Teachings', href: '/media/audio' },
      { label: 'Video Satsangs', href: '/media/video' },
      { label: 'Bhajans', href: '/media/bhajans' },
    ]
  },
  { label: 'Community', href: '/community' },
  { label: 'Contact', href: '/contact' },
]

export function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  return (
    <nav className="bg-cream-100 shadow-lg sticky top-0 z-50 border-b border-dark-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <span className="text-2xl">🕉️</span>
            <span className="text-xl font-bold text-dark-900">
              Kabir Sant Sharan
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <div key={item.label} className="relative group">
                <Link
                  href={item.href as any}
                  className="px-3 py-2 rounded-md text-dark-800 hover:text-dark-900 hover:bg-cream-200 transition-colors duration-200 flex items-center"
                  onMouseEnter={() => item.children && setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  {item.label}
                  {item.children && (
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </Link>

                {/* Dropdown Menu */}
                {item.children && openDropdown === item.label && (
                  <div
                    className="absolute top-full left-0 mt-1 w-56 bg-cream-100 border border-dark-200 rounded-md shadow-lg z-50"
                    onMouseEnter={() => setOpenDropdown(item.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href as any}
                        className="block px-4 py-3 text-dark-700 hover:bg-cream-200 hover:text-dark-900 transition-colors duration-200 border-b border-dark-100 last:border-b-0"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-dark-800 hover:bg-cream-200 transition-colors duration-200"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-dark-200">
            {navItems.map((item) => (
              <div key={item.label} className="mb-2">
                <Link
                  href={item.href as any}
                  className="block px-4 py-2 text-dark-800 hover:bg-cream-200 hover:text-dark-900 transition-colors duration-200 rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="ml-4 mt-2 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href as any}
                        className="block px-4 py-2 text-dark-600 hover:bg-cream-200 hover:text-dark-900 transition-colors duration-200 rounded-md text-sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}