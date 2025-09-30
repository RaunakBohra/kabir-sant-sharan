'use client';

import { Suspense, lazy, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { SectionErrorBoundary } from '@/components/ui/error-boundary';
import { useAdminLayout } from '@/contexts/AdminLayoutContext';

const EventForm = lazy(() => import('@/components/admin/EventForm').then(mod => ({ default: mod.EventForm })));

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();
  const { isSidebarOpen, closeSidebar } = useAdminLayout();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${params.id}`);
        if (!response.ok) {
          throw new Error('Event not found');
        }
        const data = await response.json() as { event: any };
        setEvent(data.event);
      } catch (err) {
        console.error('Error fetching event:', err);
        setError(err instanceof Error ? err.message : 'Failed to load event');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchEvent();
    }
  }, [params.id]);

  if (loading) {
    return (
      <ProtectedRoute requireAdmin={true}>
        <div className="flex">
          <AdminSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
          <div className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                <span className="ml-3 text-dark-600">Loading event...</span>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !event) {
    return (
      <ProtectedRoute requireAdmin={true}>
        <div className="flex">
          <AdminSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
          <div className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                <p className="font-medium">Error</p>
                <p className="text-sm mt-1">{error || 'Event not found'}</p>
                <button
                  onClick={() => router.push('/admin/events')}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Back to Events
                </button>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="flex">
        <SectionErrorBoundary>
          <AdminSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
        </SectionErrorBoundary>
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <SectionErrorBoundary>
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-dark-900">Edit Event</h1>
                <p className="text-dark-600 mt-1">Update event details</p>
              </div>
              <Suspense fallback={
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                  <span className="ml-3 text-dark-600">Loading event form...</span>
                </div>
              }>
                <EventForm event={event} isEdit={true} />
              </Suspense>
            </div>
          </SectionErrorBoundary>
        </div>
      </div>
    </ProtectedRoute>
  );
}