'use client';

import { useState } from 'react';
import Link from 'next/link';

export interface FABAction {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  color?: string;
}

interface FloatingActionButtonsProps {
  actions: FABAction[];
  position?: 'bottom-right' | 'bottom-left';
  mainIcon?: React.ReactNode;
}

export function FloatingActionButtons({
  actions,
  position = 'bottom-right',
  mainIcon
}: FloatingActionButtonsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const positionClasses = position === 'bottom-right'
    ? 'bottom-6 right-6'
    : 'bottom-6 left-6';

  const defaultMainIcon = (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1zM15 6h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V7a1 1 0 011-1zM4 17h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1v-4a1 1 0 011-1zM15 17h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4a1 1 0 011-1z"/>
    </svg>
  );

  return (
    <div className={`fixed ${positionClasses} z-40 lg:hidden`}>
      {/* Action Buttons - appear when opened */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 flex flex-col-reverse items-end space-y-reverse space-y-3 mb-3">
          {actions.map((action, index) => (
            <Link
              key={action.id}
              href={action.href}
              onClick={() => setIsOpen(false)}
              className={`
                flex items-center space-x-3 px-4 py-3 rounded-full shadow-lg
                transform transition-all duration-300 ease-out
                ${action.color || 'bg-cream-50 text-dark-900 border-2 border-dark-200'}
                hover:scale-105 active:scale-95
                animate-slide-up
              `}
              style={{
                animationDelay: `${index * 50}ms`,
                animationFillMode: 'backwards'
              }}
            >
              <span className="whitespace-nowrap font-medium text-sm">
                {action.label}
              </span>
              <span className="flex-shrink-0">
                {action.icon}
              </span>
            </Link>
          ))}
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 -z-10 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Main FAB Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-14 h-14 rounded-full shadow-2xl
          flex items-center justify-center
          transition-all duration-300 ease-out
          ${isOpen
            ? 'bg-dark-700 rotate-45 scale-110'
            : 'bg-dark-900 hover:bg-dark-800 active:scale-95'
          }
          text-cream-50
          touch-manipulation
        `}
        aria-label={isOpen ? 'Close menu' : 'Open quick actions'}
      >
        {mainIcon || defaultMainIcon}
      </button>

      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}