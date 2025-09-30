'use client';

import { usePathname } from 'next/navigation';
import { NavBar } from '@/components/navigation/NavBar';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/toast';

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <>
      {!isAdminPage && <NavBar />}
      <main className="flex-1">
        {children}
      </main>
      {!isAdminPage && <Footer />}
      <Toaster />
    </>
  );
}