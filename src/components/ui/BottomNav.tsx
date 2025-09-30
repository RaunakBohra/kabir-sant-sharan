'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Route } from 'next';

export interface NavItem {
  id: string;
  label: string;
  href: Route<string> | string;
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
}

interface BottomNavProps {
  items: NavItem[];
}

export function BottomNav({ items }: BottomNavProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-cream-50 border-t-2 border-dark-200 shadow-2xl lg:hidden z-50">
      <div className="flex items-center justify-around h-16 max-w-screen-xl mx-auto px-2">
        {items.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.id}
              href={item.href as any}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 touch-manipulation ${
                active
                  ? 'text-dark-900'
                  : 'text-dark-500 hover:text-dark-800'
              }`}
            >
              <div className={`transition-transform duration-200 ${active ? 'scale-110' : ''}`}>
                {active && item.activeIcon ? item.activeIcon : item.icon}
              </div>
              <span className={`text-xs mt-1 font-medium ${active ? 'text-dark-900' : 'text-dark-600'}`}>
                {item.label}
              </span>
              {active && (
                <div className="absolute bottom-0 w-12 h-1 bg-dark-900 rounded-t-full"></div>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}