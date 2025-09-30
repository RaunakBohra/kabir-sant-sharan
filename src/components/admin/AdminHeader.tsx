'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface AdminHeaderProps {
  onMenuToggle: () => void;
}

export function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="bg-cream-50 border-b border-cream-200 px-4 sm:px-6 lg:px-8 py-4 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Hamburger Menu Button - Mobile & Tablet */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 text-dark-600 hover:text-dark-900 hover:bg-cream-200 rounded-lg transition-colors touch-manipulation"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>

          <Link href="/" className="flex items-center space-x-2 text-dark-900">
            <div className="w-7 h-7 sm:w-8 sm:h-8">
              <img
                src="/kabir-saheb-logo.webp"
                alt="Kabir Saheb Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-semibold text-base sm:text-lg hidden xs:inline">Kabir Sant Sharan</span>
          </Link>
          <span className="text-dark-300 hidden sm:inline">|</span>
          <span className="text-dark-600 font-medium text-sm sm:text-base hidden sm:inline">Admin Panel</span>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <button
            type="button"
            className="p-2 text-dark-400 hover:text-dark-600 focus:outline-none focus:ring-2 focus:ring-dark-500 rounded-full transition-colors duration-200 hidden sm:block"
            title="Notifications"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.595-1.595A2 2 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
          </button>

          <div className="relative">
            <button
              type="button"
              data-testid="user-profile"
              className="flex items-center space-x-1 sm:space-x-2 p-2 text-dark-700 hover:text-dark-900 focus:outline-none focus:ring-2 focus:ring-dark-500 rounded-lg transition-colors duration-200 touch-manipulation"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <div className="w-8 h-8 bg-dark-900 text-white rounded-full flex items-center justify-center text-sm font-medium">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <span className="text-sm font-medium hidden sm:inline">{user?.name || 'Admin'}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
              </svg>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-cream-50 rounded-md shadow-lg border border-cream-200 z-50">
                <div className="py-1">
                  <button className="block w-full text-left px-4 py-2 text-sm text-dark-700 hover:bg-cream-200 transition-colors duration-200 touch-manipulation min-h-[44px]">
                    Profile Settings
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm text-dark-700 hover:bg-cream-200 transition-colors duration-200 touch-manipulation min-h-[44px]">
                    Change Password
                  </button>
                  <hr className="my-1 border-cream-200"/>
                  <Link
                    href="/"
                    className="block px-4 py-2 text-sm text-dark-700 hover:bg-cream-200 transition-colors duration-200 touch-manipulation min-h-[44px] flex items-center"
                  >
                    View Site
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 touch-manipulation min-h-[44px]"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}