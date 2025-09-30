'use client';

import { Suspense, lazy } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { SectionErrorBoundary } from '@/components/ui/error-boundary';

const Settings = lazy(() => import('@/components/admin/Settings').then(mod => ({ default: mod.Settings })));

export default function AdminSettingsPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-cream-100">
        <SectionErrorBoundary>
          <AdminHeader />
        </SectionErrorBoundary>
        <div className="flex">
          <SectionErrorBoundary>
            <AdminSidebar />
          </SectionErrorBoundary>
          <div className="flex-1 p-8">
            <SectionErrorBoundary>
              <Suspense fallback={
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                  <span className="ml-3 text-dark-600">Loading settings...</span>
                </div>
              }>
                <Settings />
              </Suspense>
            </SectionErrorBoundary>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}