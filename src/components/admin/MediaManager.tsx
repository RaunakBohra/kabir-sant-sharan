'use client';

import { useState, useEffect, useCallback } from 'react';
import { MediaUpload } from './MediaUpload';
import { MediaPreviewDialog } from './MediaManager/MediaPreviewDialog';
import { EditMediaDialog } from './MediaManager/EditMediaDialog';
import { toast } from '@/components/ui/toast';

interface MediaFile {
  id: string;
  fileName: string;
  originalName: string;
  url: string;
  type: 'audio' | 'video' | 'image' | 'document';
  size: number;
  mimeType: string;
  uploadedAt: string;
  metadata?: {
    title?: string;
    artist?: string;
    duration?: string;
    dimensions?: string;
    resolution?: string;
    altText?: string;
    description?: string;
    tags?: string[];
  };
}

export function MediaManager() {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<'all' | 'audio' | 'video' | 'image' | 'document'>('all');
  const [isUploading, setIsUploading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [previewMedia, setPreviewMedia] = useState<MediaFile | null>(null);
  const [editMedia, setEditMedia] = useState<MediaFile | null>(null);

  const loadMediaFiles = useCallback(async () => {
    setIsLoading(true);
    try {
      const typeParam = selectedType !== 'all' ? `?type=${selectedType}` : '';
      const response = await fetch(`/api/media/upload${typeParam}`);
      const data = await response.json() as { files: MediaFile[] };
      setMediaFiles(data.files || []);
    } catch (error) {
      console.error('Failed to load media files:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedType]);

  useEffect(() => {
    loadMediaFiles();
  }, [loadMediaFiles]);


  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark-900">Media Manager</h1>
          <p className="text-dark-600 mt-1">Upload and manage spiritual content media files</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="bg-dark-900 text-white px-4 py-2 rounded-lg hover:bg-dark-800 transition-colors duration-200 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
            </svg>
            <span>{showUpload ? 'Hide Upload' : 'Upload Media'}</span>
          </button>
        </div>
      </div>

      {/* Upload Interface */}
      {showUpload && (
        <div className="bg-cream-50 rounded-lg shadow-sm border border-cream-200 p-6">
          <MediaUpload
            onUploadSuccess={loadMediaFiles}
            onUploadStart={() => setIsUploading(true)}
            onUploadEnd={() => setIsUploading(false)}
          />
        </div>
      )}

      {/* Filter Tabs */}
      <div className="bg-cream-50 rounded-lg shadow-lg border border-cream-200">
        <div className="border-b border-cream-200">
          <nav className="flex space-x-8 px-6">
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
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
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

        {/* Media Grid */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dark-900"></div>
            </div>
          ) : filteredFiles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredFiles.map((file) => (
                <div key={file.id} className="bg-cream-100 rounded-lg p-4 hover:bg-cream-200 transition-colors">
                  <div className="flex items-center justify-center mb-3">
                    {getFileTypeIcon(file.type)}
                  </div>
                  <div className="text-center">
                    <h3 className="font-medium text-dark-900 text-sm mb-1 truncate" title={file.originalName}>
                      {file.metadata?.title || file.originalName}
                    </h3>
                    {file.metadata?.artist && (
                      <p className="text-xs text-dark-500 mb-1">by {file.metadata.artist}</p>
                    )}
                    {file.metadata?.duration && (
                      <p className="text-xs text-dark-500 mb-1">{file.metadata.duration}</p>
                    )}
                    <p className="text-xs text-dark-500">{formatFileSize(file.size)}</p>
                    <p className="text-xs text-dark-400 mt-1">
                      {new Date(file.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center justify-center space-x-2 mt-3">
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
                    <button
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = file.url;
                        link.download = file.originalName;
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
                  </div>
                </div>
              ))}
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