'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/components/ui/toast';
import { MediaFile } from '@/types';

interface MediaPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  media: MediaFile | null;
}

export function MediaPreviewDialog({ open, onOpenChange, media }: MediaPreviewDialogProps) {
  if (!media) return null;

  const handleCopyUrl = () => {
    const url = media.downloadUrl || media.streamingUrl || '';
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard');
  };

  const handleDownload = () => {
    if (media.downloadUrl) {
      const link = document.createElement('a');
      link.href = media.downloadUrl;
      link.download = media.title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Download started');
    } else {
      toast.error('Download not available for this file');
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes || bytes === 0) return '0 Bytes';
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
              src={media.streamingUrl || media.downloadUrl || ''}
              alt={media.title}
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
            <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg p-6 text-center">
              <svg className="w-16 h-16 mx-auto text-white mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
              </svg>
              <h3 className="text-white text-xl font-semibold mb-2">
                {media.title}
              </h3>
              <p className="text-purple-100 text-sm">by {media.author}</p>
              {media.duration && (
                <p className="text-purple-200 text-sm mt-2">Duration: {media.duration}</p>
              )}
            </div>
            <div className="bg-dark-900 rounded-lg p-4">
              <audio
                controls
                className="w-full"
                preload="metadata"
              >
                <source src={`/api/media/stream/${media.id}`} type={media.mimeType || 'audio/mpeg'} />
                Your browser does not support the audio element.
              </audio>
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="bg-dark-900 rounded-lg overflow-hidden">
            <video
              controls
              className="w-full h-auto max-h-[60vh]"
              preload="metadata"
              poster={media.thumbnailKey ? `/api/media/stream/${media.id}?thumbnail=true` : undefined}
            >
              <source src={`/api/media/stream/${media.id}`} type={media.mimeType || 'video/mp4'} />
              Your browser does not support the video element.
            </video>
            <div className="p-4 text-center">
              <h3 className="text-white text-lg font-semibold mb-1">
                {media.title}
              </h3>
              <p className="text-gray-300 text-sm">by {media.author}</p>
              {media.duration && (
                <p className="text-gray-400 text-sm mt-1">Duration: {media.duration}</p>
              )}
            </div>
          </div>
        );

      case 'document':
        if (media.mimeType === 'application/pdf') {
          return (
            <div className="bg-cream-50 rounded-lg overflow-hidden" style={{ height: '70vh' }}>
              <iframe
                src={media.streamingUrl || media.downloadUrl || ''}
                className="w-full h-full border-0"
                title={media.title}
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
            {media.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Preview Area */}
          {renderPreview()}

          {/* Metadata - Compact */}
          <div className="flex flex-wrap gap-3 text-xs text-dark-600">
            <span>Author: <strong className="text-dark-900">{media.author}</strong></span>
            <span>•</span>
            <span>Size: <strong className="text-dark-900">{formatFileSize(media.fileSize)}</strong></span>
            <span>•</span>
            <span>Type: <strong className="text-dark-900">{media.type}</strong></span>
            <span>•</span>
            <span>{media.published ? '✓ Published' : 'Draft'}{media.featured ? ' • Featured' : ''}</span>
          </div>

          {/* Actions - Compact */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-cream-200">
            <button
              onClick={handleCopyUrl}
              className="p-2 text-dark-700 hover:bg-cream-100 rounded-lg transition-colors"
              title="Copy URL"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 text-white bg-dark-900 rounded-lg hover:bg-dark-800 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3"/>
              </svg>
              <span>Download</span>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}