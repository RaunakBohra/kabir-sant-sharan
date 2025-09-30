'use client';

import { Suspense, lazy } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { SectionErrorBoundary } from '@/components/ui/error-boundary';
import { useAdminLayout } from '@/contexts/AdminLayoutContext';

const PerformanceMonitor = lazy(() => import('@/components/admin/PerformanceMonitor'));

export default function AdminPerformancePage() {
  const { isSidebarOpen, closeSidebar } = useAdminLayout();

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-cream-100">
        <div className="flex">
          <SectionErrorBoundary>
            <AdminSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
          </SectionErrorBoundary>
          <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
            <SectionErrorBoundary>
              <Suspense fallback={
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dark-900"></div>
                  <span className="ml-3 text-dark-600">Loading performance monitor...</span>
                </div>
              }>
                <PerformanceMonitor />
              </Suspense>
            </SectionErrorBoundary>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}