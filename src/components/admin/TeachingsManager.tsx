'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
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

export function TeachingsManager() {
  const router = useRouter();
  const [teachings, setTeachings] = useState<Teaching[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; title: string } | null>(null);

  const loadTeachings = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/teachings/?limit=50');
      const data = await response.json() as { teachings: Teaching[] };
      setTeachings(data.teachings || []);
    } catch (error) {
      console.error('Failed to load teachings:', error);
      toast.error('Failed to load teachings');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTeachings();
  }, [loadTeachings]);

  const handleAddTeaching = () => {
    router.push('/admin/teachings/new');
  };

  const handleEditTeaching = (id: string) => {
    router.push(`/admin/teachings/${id}/edit`);
  };

  const handleDeleteClick = (id: string, title: string) => {
    setItemToDelete({ id, title });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    const response = await fetch(`/api/teachings/${itemToDelete.id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Failed to delete');
    }

    await loadTeachings();
  };

  const publishedCount = teachings.filter(t => new Date(t.published_at) <= new Date()).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark-900">Teachings Management</h1>
          <p className="text-dark-600 mt-1">Manage spiritual teachings and content</p>
        </div>
        <button
          onClick={handleAddTeaching}
          className="bg-dark-900 text-white px-4 py-2 rounded-lg hover:bg-dark-800 transition-colors duration-200 flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
          </svg>
          <span>Add Teaching</span>
        </button>
      </div>

      {/* Stats - Compact Single Line */}
      <div className="bg-cream-50 p-3 rounded-lg shadow-sm border border-cream-200">
        <div className="flex items-center justify-around text-center divide-x divide-cream-200">
          <div className="flex-1 px-4">
            <p className="text-xs text-dark-600">Total</p>
            <p className="text-lg font-bold text-dark-900">{teachings.length}</p>
          </div>
          <div className="flex-1 px-4">
            <p className="text-xs text-dark-600">Published</p>
            <p className="text-lg font-bold text-dark-900">{publishedCount}</p>
          </div>
          <div className="flex-1 px-4">
            <p className="text-xs text-dark-600">Drafts</p>
            <p className="text-lg font-bold text-dark-900">{teachings.length - publishedCount}</p>
          </div>
        </div>
      </div>

      {/* Teachings List */}
      <div className="bg-cream-50 rounded-lg shadow-lg border border-cream-200">
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dark-900"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {teachings.length > 0 ? (
                teachings.map((teaching) => (
                  <div key={teaching.id} className="flex items-center justify-between p-4 border border-cream-200 rounded-lg hover:bg-cream-100 transition-colors duration-200">
                    <div className="flex-1">
                      <h3 className="font-medium text-dark-900">{teaching.title}</h3>
                      <p className="text-sm text-dark-600 mt-1">{teaching.excerpt}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-dark-500">
                        <span>By {teaching.author}</span>
                        <span>•</span>
                        <span>{teaching.category}</span>
                        <span>•</span>
                        <span>{new Date(teaching.published_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleEditTeaching(teaching.id)}
                        className="p-2 text-dark-400 hover:text-dark-900 transition-colors"
                        title="Edit teaching"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteClick(teaching.id, teaching.title)}
                        className="p-2 text-dark-400 hover:text-dark-700 transition-colors"
                        title="Delete teaching"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        itemType="teaching"
        itemTitle={itemToDelete?.title || ''}
      />
    </div>
  );
}