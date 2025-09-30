'use client';

import { Suspense, lazy } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { SectionErrorBoundary } from '@/components/ui/error-boundary';

const EventForm = lazy(() => import('@/components/admin/EventForm').then(mod => ({ default: mod.EventForm })));

export default function NewEventPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="flex">
        <SectionErrorBoundary>
          <AdminSidebar />
        </SectionErrorBoundary>
        <div className="flex-1 p-8">
          <SectionErrorBoundary>
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-dark-900">Create New Event</h1>
                <p className="text-dark-600 mt-1">Add a new spiritual event or gathering</p>
              </div>
              <Suspense fallback={
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                  <span className="ml-3 text-dark-600">Loading event form...</span>
                </div>
              }>
                <EventForm />
              </Suspense>
            </div>
          </SectionErrorBoundary>
        </div>
      </div>
    </ProtectedRoute>
  );
}