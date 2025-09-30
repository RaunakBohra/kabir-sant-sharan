'use client';

import { useState, useEffect, useCallback } from 'react';
import { UploadMediaDialog } from './MediaManager/UploadMediaDialog';
import { MediaPreviewDialog } from './MediaManager/MediaPreviewDialog';
import { EditMediaDialog } from './MediaManager/EditMediaDialog';
import { toast } from '@/components/ui/toast';
import { apiRequest } from '@/lib/api-client';
import { extractProductNameFromR2Key, formatFileSize, formatDuration } from '@/lib/media-utils';

interface MediaFile {
  id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  tags?: string;
  author: string;
  duration?: string;
  fileSize?: number;
  mimeType?: string;
  r2Key: string;
  r2Bucket: string;
  thumbnailKey?: string;
  streamingUrl?: string;
  downloadUrl?: string;
  transcription?: string;
  featured: boolean;
  published: boolean;
  views: number;
  downloads: number;
  likes: number;
  language: string;
  uploadedBy: string;
  publishedAt?: string;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export function MediaManager() {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<'all' | 'audio' | 'video' | 'image' | 'document'>('all');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [previewMedia, setPreviewMedia] = useState<MediaFile | null>(null);
  const [editMedia, setEditMedia] = useState<MediaFile | null>(null);

  const loadMediaFiles = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        limit: '100',
        offset: '0',
        published: 'false' // Show all media for admin (both published and unpublished)
      });

      if (selectedType !== 'all') {
        params.append('type', selectedType);
      }

      const response = await apiRequest(`/api/media?${params}`);
      const data = await response.json();
      setMediaFiles(data.media || []);
    } catch (error) {
      console.error('Failed to load media files:', error);
      toast.error('Failed to load media files');
    } finally {
      setIsLoading(false);
    }
  }, [selectedType]);

  useEffect(() => {
    loadMediaFiles();
  }, [loadMediaFiles]);



  const getFileTypeIcon = (type: string) => {
    switch (type) {
      case 'audio':
        return (
          <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
          </svg>
        );
      case 'video':
        return (
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
          </svg>
        );
      case 'image':
        return (
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
        );
      default:
        return (
          <svg className="w-8 h-8 text-dark-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        );
    }
  };

  const filteredFiles = selectedType === 'all'
    ? mediaFiles
    : mediaFiles.filter(file => file.type === selectedType);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-dark-900">Media Manager</h1>
          <p className="text-sm sm:text-base text-dark-600 mt-1">Upload and manage spiritual content media files</p>
        </div>
        <button
          onClick={() => setUploadDialogOpen(true)}
          className="bg-dark-900 text-white px-4 py-3 rounded-lg hover:bg-dark-800 transition-colors duration-200 flex items-center justify-center space-x-2 touch-manipulation sm:w-auto w-full"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
          </svg>
          <span>Upload Media</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="bg-cream-50 rounded-lg shadow-lg border border-cream-200">
        <div className="border-b border-cream-200 overflow-x-auto">
          <nav className="flex space-x-4 sm:space-x-8 px-4 sm:px-6 min-w-max sm:min-w-0">
            {[
              { id: 'all', label: 'All Files', count: mediaFiles.length },
              { id: 'audio', label: 'Audio', count: mediaFiles.filter(f => f.type === 'audio').length },
              { id: 'video', label: 'Video', count: mediaFiles.filter(f => f.type === 'video').length },
              { id: 'image', label: 'Images', count: mediaFiles.filter(f => f.type === 'image').length },
              { id: 'document', label: 'Documents', count: mediaFiles.filter(f => f.type === 'document').length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedType(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors duration-200 whitespace-nowrap ${
                  selectedType === tab.id
                    ? 'border-dark-900 text-dark-900'
                    : 'border-transparent text-dark-500 hover:text-dark-700 hover:border-cream-300'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>

        {/* Media Table */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dark-900"></div>
            </div>
          ) : filteredFiles.length > 0 ? (
            <div className="overflow-x-auto" data-testid="media-grid">
              <table className="w-full border-collapse border border-cream-200 rounded-lg">
                <thead>
                  <tr className="bg-cream-100">
                    <th className="border border-cream-200 px-4 py-3 text-left text-dark-900 font-medium">Type</th>
                    <th className="border border-cream-200 px-4 py-3 text-left text-dark-900 font-medium">Title</th>
                    <th className="border border-cream-200 px-4 py-3 text-left text-dark-900 font-medium">Product Name</th>
                    <th className="border border-cream-200 px-4 py-3 text-left text-dark-900 font-medium">Author</th>
                    <th className="border border-cream-200 px-4 py-3 text-left text-dark-900 font-medium">Duration</th>
                    <th className="border border-cream-200 px-4 py-3 text-left text-dark-900 font-medium">Size</th>
                    <th className="border border-cream-200 px-4 py-3 text-left text-dark-900 font-medium">Status</th>
                    <th className="border border-cream-200 px-4 py-3 text-left text-dark-900 font-medium">Created</th>
                    <th className="border border-cream-200 px-4 py-3 text-left text-dark-900 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFiles.map((file) => (
                    <tr key={file.id} className="hover:bg-cream-50 transition-colors" data-testid="media-card">
                      <td className="border border-cream-200 px-4 py-3">
                        <div className="flex items-center justify-center w-8">
                          {getFileTypeIcon(file.type)}
                        </div>
                      </td>
                      <td className="border border-cream-200 px-4 py-3">
                        <div className="font-medium text-dark-900 text-sm" title={file.title}>
                          {file.title}
                        </div>
                      </td>
                      <td className="border border-cream-200 px-4 py-3">
                        <div className="text-sm text-dark-700">
                          {extractProductNameFromR2Key(file.r2Key)}
                        </div>
                      </td>
                      <td className="border border-cream-200 px-4 py-3">
                        <div className="text-sm text-dark-600">
                          {file.author}
                        </div>
                      </td>
                      <td className="border border-cream-200 px-4 py-3">
                        <div className="text-sm text-dark-600">
                          {file.duration ? formatDuration(file.duration) : '-'}
                        </div>
                      </td>
                      <td className="border border-cream-200 px-4 py-3">
                        <div className="text-sm text-dark-600">
                          {formatFileSize(file.fileSize)}
                        </div>
                      </td>
                      <td className="border border-cream-200 px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <span className={`inline-block w-2 h-2 rounded-full ${
                            file.published ? 'bg-green-500' : 'bg-yellow-500'
                          }`} title={file.published ? 'Published' : 'Draft'}></span>
                          <span className="text-xs text-dark-600">
                            {file.published ? 'Published' : 'Draft'}
                          </span>
                          {file.featured && (
                            <span className="text-xs text-yellow-600" title="Featured">⭐</span>
                          )}
                        </div>
                        <div className="text-xs text-dark-400 mt-1">
                          {file.views} views • {file.likes} likes
                        </div>
                      </td>
                      <td className="border border-cream-200 px-4 py-3">
                        <div className="text-sm text-dark-600">
                          {new Date(file.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="border border-cream-200 px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setPreviewMedia(file)}
                            className="p-1 text-dark-400 hover:text-blue-600 transition-colors"
                            title="Preview"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                            </svg>
                          </button>
                          <button
                            onClick={() => setEditMedia(file)}
                            className="p-1 text-dark-400 hover:text-amber-600 transition-colors"
                            title="Edit"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                            </svg>
                          </button>
                          {file.downloadUrl && (
                            <button
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = file.downloadUrl!;
                                link.download = extractProductNameFromR2Key(file.r2Key);
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                                toast.success('Download started');
                              }}
                              className="p-1 text-dark-400 hover:text-green-600 transition-colors"
                              title="Download"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                              </svg>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="w-12 h-12 text-dark-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
              </svg>
              <h3 className="text-lg font-medium text-dark-900 mb-2">No media files yet</h3>
              <p className="text-dark-600">Upload your first spiritual content media file.</p>
            </div>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <UploadMediaDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onUploadSuccess={loadMediaFiles}
      />

      <MediaPreviewDialog
        open={!!previewMedia}
        onOpenChange={(open) => !open && setPreviewMedia(null)}
        media={previewMedia}
      />

      <EditMediaDialog
        open={!!editMedia}
        onOpenChange={(open) => !open && setEditMedia(null)}
        media={editMedia}
        onSave={(updatedMedia) => {
          setMediaFiles(prev =>
            prev.map(f => f.id === updatedMedia.id ? updatedMedia : f)
          );
        }}
      />
    </div>
  );
}