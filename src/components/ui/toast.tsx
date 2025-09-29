'use client';

import { Toaster as Sonner } from 'sonner';

export function Toaster() {
  return (
    <Sonner
      position="top-right"
      expand={true}
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast: 'bg-cream-50 border-cream-200 text-dark-900',
          title: 'text-dark-900 font-semibold',
          description: 'text-dark-600',
          actionButton: 'bg-dark-900 text-white',
          cancelButton: 'bg-cream-200 text-dark-900',
          closeButton: 'bg-cream-100 border-cream-300',
        },
      }}
    />
  );
}

export { toast } from 'sonner';