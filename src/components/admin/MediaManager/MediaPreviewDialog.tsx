'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  };
}

interface MediaPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  media: MediaFile | null;
}

export function MediaPreviewDialog({ open, onOpenChange, media }: MediaPreviewDialogProps) {
  if (!media) return null;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(media.url);
    toast.success('URL copied to clipboard');
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = media.url;
    link.download = media.originalName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Download started');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderPreview = () => {
    switch (media.type) {
      case 'image':
        return (
          <div className="relative bg-dark-900 rounded-lg overflow-hidden">
            <img
              src={media.url}
              alt={media.metadata?.title || media.originalName}
              className="w-full h-auto max-h-[70vh] object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder-image.png';
              }}
            />
          </div>
        );

      case 'audio':
        return (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg p-8 text-center">
              <svg className="w-24 h-24 mx-auto text-white mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
              </svg>
              <h3 className="text-white text-xl font-semibold mb-2">
                {media.metadata?.title || media.originalName}
              </h3>
              {media.metadata?.artist && (
                <p className="text-purple-100 text-sm">by {media.metadata.artist}</p>
              )}
              {media.metadata?.duration && (
                <p className="text-purple-200 text-sm mt-2">Duration: {media.metadata.duration}</p>
              )}
            </div>
            <audio
              controls
              className="w-full"
              preload="metadata"
            >
              <source src={media.url} type={media.mimeType} />
              Your browser does not support the audio element.
            </audio>
          </div>
        );

      case 'video':
        return (
          <div className="bg-dark-900 rounded-lg overflow-hidden">
            <video
              controls
              className="w-full max-h-[70vh]"
              preload="metadata"
            >
              <source src={media.url} type={media.mimeType} />
              Your browser does not support the video element.
            </video>
            {media.metadata?.resolution && (
              <div className="p-2 bg-dark-800 text-white text-sm text-center">
                Resolution: {media.metadata.resolution}
              </div>
            )}
          </div>
        );

      case 'document':
        if (media.mimeType === 'application/pdf') {
          return (
            <div className="bg-cream-50 rounded-lg overflow-hidden" style={{ height: '70vh' }}>
              <iframe
                src={media.url}
                className="w-full h-full border-0"
                title={media.originalName}
              />
            </div>
          );
        }
        return (
          <div className="bg-cream-100 rounded-lg p-12 text-center">
            <svg className="w-24 h-24 mx-auto text-dark-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <p className="text-dark-600 mb-4">Preview not available for this file type</p>
            <button
              onClick={handleDownload}
              className="bg-dark-900 text-white px-6 py-2 rounded-lg hover:bg-dark-800 transition-colors"
            >
              Download to View
            </button>
          </div>
        );

      default:
        return <p className="text-center text-dark-500">No preview available</p>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-dark-900">
            {media.metadata?.title || media.originalName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Preview Area */}
          {renderPreview()}

          {/* Metadata */}
          <div className="bg-cream-50 rounded-lg p-4 space-y-2">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-dark-700">File Name:</span>
                <p className="text-dark-900">{media.originalName}</p>
              </div>
              <div>
                <span className="font-medium text-dark-700">File Size:</span>
                <p className="text-dark-900">{formatFileSize(media.size)}</p>
              </div>
              <div>
                <span className="font-medium text-dark-700">Type:</span>
                <p className="text-dark-900">{media.type} ({media.mimeType})</p>
              </div>
              <div>
                <span className="font-medium text-dark-700">Uploaded:</span>
                <p className="text-dark-900">{new Date(media.uploadedAt).toLocaleString()}</p>
              </div>
              {media.metadata?.dimensions && (
                <div>
                  <span className="font-medium text-dark-700">Dimensions:</span>
                  <p className="text-dark-900">{media.metadata.dimensions}</p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-2 border-t border-cream-200">
            <button
              onClick={handleCopyUrl}
              className="flex items-center space-x-2 px-4 py-2 text-dark-700 bg-cream-100 rounded-lg hover:bg-cream-200 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
              <span>Copy URL</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center space-x-2 px-4 py-2 text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <span>Download</span>
            </button>
            <button
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 text-dark-700 bg-cream-200 rounded-lg hover:bg-cream-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}