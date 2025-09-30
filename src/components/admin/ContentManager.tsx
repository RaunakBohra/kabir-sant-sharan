'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { CreateEventDialog } from './ContentManager/CreateEventDialog';
import { DeleteConfirmDialog } from './ContentManager/DeleteConfirmDialog';
import { toast } from '@/components/ui/toast';

interface Teaching {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string[];
  published_at: string;
  created_at: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  event_date: string;
  event_type: string;
  is_featured: boolean;
  registration_required: boolean;
  current_attendees: number;
}

export function ContentManager() {
  const router = useRouter();
  const [activeContentType, setActiveContentType] = useState<'teachings' | 'events'>('teachings');
  const [teachings, setTeachings] = useState<Teaching[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Dialog states
  const [createEventOpen, setCreateEventOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; title: string; type: 'teaching' | 'event' } | null>(null);

  const loadContent = useCallback(async () => {
    setIsLoading(true);
    try {
      if (activeContentType === 'teachings') {
        const response = await fetch('/api/teachings/?limit=50');
        const data = await response.json() as { teachings: Teaching[] };
        setTeachings(data.teachings || []);
      } else {
        const response = await fetch('/api/events/?limit=50');
        const data = await response.json() as { events: Event[] };
        setEvents(data.events || []);
      }
    } catch (error) {
      console.error('Failed to load content:', error);
      toast.error('Failed to load content');
    } finally {
      setIsLoading(false);
    }
  }, [activeContentType]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  const handleAddContent = () => {
    if (activeContentType === 'teachings') {
      router.push('/admin/teachings/new');
    } else {
      setCreateEventOpen(true);
    }
  };

  const handleEditTeaching = (id: string) => {
    router.push(`/admin/teachings/${id}/edit`);
  };

  const handleDeleteClick = (id: string, title: string, type: 'teaching' | 'event') => {
    setItemToDelete({ id, title, type });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    const endpoint = itemToDelete.type === 'teaching' ? '/api/teachings' : '/api/events';
    const response = await fetch(`${endpoint}/${itemToDelete.id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Failed to delete');
    }

    await loadContent();
  };

  const contentStats = {
    teachings: teachings.length,
    events: events.length,
    published: teachings.filter(t => new Date(t.published_at) <= new Date()).length,
    upcoming: events.filter(e => new Date(e.event_date) > new Date()).length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-dark-900">Content Management</h1>
          <p className="text-sm sm:text-base text-dark-600 mt-1">Manage teachings, events, and spiritual content</p>
        </div>
        <button
          onClick={handleAddContent}
          className="bg-dark-900 text-white px-4 py-3 rounded-lg hover:bg-dark-800 transition-colors duration-200 flex items-center justify-center space-x-2 touch-manipulation sm:w-auto w-full"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
          </svg>
          <span>Add {activeContentType === 'teachings' ? 'Teaching' : 'Event'}</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-cream-50 p-6 rounded-lg shadow-sm border border-cream-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-dark-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-dark-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-dark-600">Total Teachings</p>
              <p className="text-2xl font-bold text-dark-900">{contentStats.teachings}</p>
            </div>
          </div>
        </div>

        <div className="bg-cream-50 p-6 rounded-lg shadow-sm border border-cream-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-dark-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-dark-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-dark-600">Total Events</p>
              <p className="text-2xl font-bold text-dark-900">{contentStats.events}</p>
            </div>
          </div>
        </div>

        <div className="bg-cream-50 p-6 rounded-lg shadow-sm border border-cream-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-dark-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-dark-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-dark-600">Published</p>
              <p className="text-2xl font-bold text-dark-900">{contentStats.published}</p>
            </div>
          </div>
        </div>

        <div className="bg-cream-50 p-6 rounded-lg shadow-sm border border-cream-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-dark-600">Upcoming Events</p>
              <p className="text-2xl font-bold text-dark-900">{contentStats.upcoming}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Type Tabs */}
      <div className="bg-cream-50 rounded-lg shadow-lg border border-cream-200">
        <div className="border-b border-cream-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveContentType('teachings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeContentType === 'teachings'
                  ? 'border-dark-900 text-dark-900'
                  : 'border-transparent text-dark-500 hover:text-dark-700 hover:border-cream-300'
              }`}
            >
              Teachings ({teachings.length})
            </button>
            <button
              onClick={() => setActiveContentType('events')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeContentType === 'events'
                  ? 'border-dark-900 text-dark-900'
                  : 'border-transparent text-dark-500 hover:text-dark-700 hover:border-cream-300'
              }`}
            >
              Events ({events.length})
            </button>
          </nav>
        </div>

        {/* Content List */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dark-900"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {activeContentType === 'teachings' ? (
                teachings.length > 0 ? (
                  teachings.map((teaching) => (
                    <div key={teaching.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-cream-200 rounded-lg hover:bg-cream-100 transition-colors duration-200 gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-dark-900 truncate">{teaching.title}</h3>
                        <p className="text-sm text-dark-600 mt-1 line-clamp-2">{teaching.excerpt}</p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-dark-500">
                          <span>By {teaching.author}</span>
                          <span>•</span>
                          <span>{teaching.category}</span>
                          <span>•</span>
                          <span>{new Date(teaching.published_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 sm:ml-4 flex-shrink-0 justify-end sm:justify-start">
                        <button
                          onClick={() => handleEditTeaching(teaching.id)}
                          className="p-2 sm:p-2 text-dark-400 hover:text-dark-600 transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
                          title="Edit teaching"
                          aria-label="Edit teaching"
                        >
                          <svg className="w-5 h-5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteClick(teaching.id, teaching.title, 'teaching')}
                          className="p-2 sm:p-2 text-red-400 hover:text-red-600 transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
                          title="Delete teaching"
                          aria-label="Delete teaching"
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                    </svg>
                    <h3 className="text-lg font-medium text-dark-900 mb-2">No teachings yet</h3>
                    <p className="text-dark-600">Start by creating your first spiritual teaching.</p>
                  </div>
                )
              ) : (
                events.length > 0 ? (
                  events.map((event) => (
                    <div key={event.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-cream-200 rounded-lg hover:bg-cream-100 transition-colors duration-200 gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-dark-900 truncate">{event.title}</h3>
                        <p className="text-sm text-dark-600 mt-1 line-clamp-2">{event.description}</p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-dark-500">
                          <span>{event.location}</span>
                          <span>•</span>
                          <span>{event.event_type}</span>
                          <span>•</span>
                          <span>{new Date(event.event_date).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{event.current_attendees} attending</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 sm:ml-4 flex-shrink-0 justify-end sm:justify-start">
                        <button
                          className="p-2 sm:p-2 text-dark-400 hover:text-dark-600 transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
                          title="Edit event"
                          aria-label="Edit event"
                        >
                          <svg className="w-5 h-5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteClick(event.id, event.title, 'event')}
                          className="p-2 sm:p-2 text-red-400 hover:text-red-600 transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
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
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <CreateEventDialog
        open={createEventOpen}
        onOpenChange={setCreateEventOpen}
        onSuccess={loadContent}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        itemType={itemToDelete?.type || 'teaching'}
        itemTitle={itemToDelete?.title || ''}
      />
    </div>
  );
}