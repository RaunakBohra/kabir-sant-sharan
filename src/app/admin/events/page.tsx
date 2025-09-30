'use client';

import { Suspense, lazy } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { SectionErrorBoundary } from '@/components/ui/error-boundary';

const EventsManager = lazy(() => import('@/components/admin/EventsManager').then(mod => ({ default: mod.EventsManager })));

export default function AdminEventsPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="flex">
        <SectionErrorBoundary>
          <AdminSidebar />
        </SectionErrorBoundary>
        <div className="flex-1 p-8">
          <SectionErrorBoundary>
            <Suspense fallback={
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                <span className="ml-3 text-dark-600">Loading events manager...</span>
              </div>
            }>
              <EventsManager />
            </Suspense>
          </SectionErrorBoundary>
        </div>
      </div>
    </ProtectedRoute>
  );
}