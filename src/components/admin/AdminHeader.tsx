'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export function AdminHeader() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="bg-cream-50 border-b border-cream-200 px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2 text-dark-900">
            <div className="w-8 h-8">
              <img
                src="/kabir-saheb-logo.webp"
                alt="Kabir Saheb Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-semibold text-lg">Kabir Sant Sharan</span>
          </Link>
          <span className="text-dark-300">|</span>
          <span className="text-dark-600 font-medium">Admin Panel</span>
        </div>

        <div className="flex items-center space-x-4">
          <button
            type="button"
            className="p-2 text-dark-400 hover:text-dark-600 focus:outline-none focus:ring-2 focus:ring-dark-500 rounded-full transition-colors duration-200"
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
              className="flex items-center space-x-2 p-2 text-dark-700 hover:text-dark-900 focus:outline-none focus:ring-2 focus:ring-dark-500 rounded-lg transition-colors duration-200"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <div className="w-8 h-8 bg-dark-900 text-white rounded-full flex items-center justify-center text-sm font-medium">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <span className="text-sm font-medium">{user?.name || 'Admin'}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
              </svg>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-cream-50 rounded-md shadow-lg border border-cream-200 z-50">
                <div className="py-1">
                  <button className="block w-full text-left px-4 py-2 text-sm text-dark-700 hover:bg-cream-200 transition-colors duration-200">
                    Profile Settings
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm text-dark-700 hover:bg-cream-200 transition-colors duration-200">
                    Change Password
                  </button>
                  <hr className="my-1 border-cream-200"/>
                  <Link
                    href="/"
                    className="block px-4 py-2 text-sm text-dark-700 hover:bg-cream-200 transition-colors duration-200"
                  >
                    View Site
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
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