'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { DeleteConfirmDialog } from './ContentManager/DeleteConfirmDialog';
import { toast } from '@/components/ui/toast';

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  type: string;
  featured: boolean;
  registrationRequired: boolean;
  currentAttendees: number;
}

export function EventsManager() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; title: string } | null>(null);

  const loadEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/events/?limit=50');
      const data = await response.json() as { events: Event[] };
      setEvents(data.events || []);
    } catch (error) {
      console.error('Failed to load events:', error);
      toast.error('Failed to load events');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const handleAddEvent = () => {
    router.push('/admin/events/new');
  };

  const handleEditEvent = (id: string) => {
    router.push(`/admin/events/${id}/edit`);
  };

  const handleDeleteClick = (id: string, title: string) => {
    setItemToDelete({ id, title });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    const response = await fetch(`/api/events/${itemToDelete.id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Failed to delete');
    }

    await loadEvents();
  };

  const upcomingCount = events.filter(e => new Date(e.startDate) > new Date()).length;
  const pastCount = events.filter(e => new Date(e.startDate) <= new Date()).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-dark-900">Events Management</h1>
          <p className="text-sm sm:text-base text-dark-600 mt-1">Manage spiritual events and gatherings</p>
        </div>
        <button
          onClick={handleAddEvent}
          className="bg-dark-900 text-white px-4 py-3 rounded-lg hover:bg-dark-800 transition-colors duration-200 flex items-center justify-center space-x-2 touch-manipulation sm:w-auto w-full"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
          </svg>
          <span>Add Event</span>
        </button>
      </div>

      {/* Stats - Compact Single Line */}
      <div className="bg-cream-50 p-3 rounded-lg shadow-sm border border-cream-200">
        <div className="flex items-center justify-around text-center divide-x divide-cream-200">
          <div className="flex-1 px-4">
            <p className="text-xs text-dark-600">Total</p>
            <p className="text-lg font-bold text-dark-900">{events.length}</p>
          </div>
          <div className="flex-1 px-4">
            <p className="text-xs text-dark-600">Upcoming</p>
            <p className="text-lg font-bold text-dark-900">{upcomingCount}</p>
          </div>
          <div className="flex-1 px-4">
            <p className="text-xs text-dark-600">Past</p>
            <p className="text-lg font-bold text-dark-900">{pastCount}</p>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="bg-cream-50 rounded-lg shadow-lg border border-cream-200">
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dark-900"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {events.length > 0 ? (
                events.map((event) => (
                  <div key={event.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-cream-200 rounded-lg hover:bg-cream-100 transition-colors duration-200 gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 flex-wrap">
                        <h3 className="font-medium text-dark-900 truncate">{event.title}</h3>
                        {event.featured && (
                          <span className="bg-cream-200 text-dark-800 text-xs px-2 py-0.5 rounded-full whitespace-nowrap">Featured</span>
                        )}
                      </div>
                      <p className="text-sm text-dark-600 mt-1 line-clamp-2">{event.description}</p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-dark-500">
                        <span className="truncate">{event.location}</span>
                        <span>•</span>
                        <span>{event.type}</span>
                        <span>•</span>
                        <span>{new Date(event.startDate).toLocaleDateString()}</span>
                        {event.registrationRequired && (
                          <>
                            <span>•</span>
                            <span>{event.currentAttendees} attending</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 sm:ml-4 flex-shrink-0 justify-end sm:justify-start">
                      <button
                        onClick={() => handleEditEvent(event.id)}
                        className="p-2 text-dark-400 hover:text-dark-900 transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
                        title="Edit event"
                        aria-label="Edit event"
                      >
                        <svg className="w-5 h-5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteClick(event.id, event.title)}
                        className="p-2 text-dark-400 hover:text-dark-700 transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
                        title="Delete event"
                        aria-label="Delete event"
                      >
                        <svg className="w-5 h-5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <svg className="w-12 h-12 text-dark-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  <h3 className="text-lg font-medium text-dark-900 mb-2">No events yet</h3>
                  <p className="text-dark-600">Start by creating your first spiritual event.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        itemType="event"
        itemTitle={itemToDelete?.title || ''}
      />
    </div>
  );
}