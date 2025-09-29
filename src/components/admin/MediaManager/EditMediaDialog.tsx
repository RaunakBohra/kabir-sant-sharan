'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from '@/components/ui/toast';
import { Label } from '@/components/ui/label';

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

interface EditMediaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  media: MediaFile | null;
  onSave: (updatedMedia: MediaFile) => void;
}

export function EditMediaDialog({ open, onOpenChange, media, onSave }: EditMediaDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    description: '',
    altText: '',
    tags: ''
  });

  useEffect(() => {
    if (media) {
      setFormData({
        title: media.metadata?.title || media.originalName || '',
        artist: media.metadata?.artist || '',
        description: media.metadata?.description || '',
        altText: media.metadata?.altText || '',
        tags: media.metadata?.tags?.join(', ') || ''
      });
    }
  }, [media]);

  if (!media) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/media/upload/${media.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metadata: {
            ...media.metadata,
            title: formData.title,
            artist: formData.artist,
            description: formData.description,
            altText: formData.altText,
            tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
          }
        })
      });

      if (!response.ok) throw new Error('Failed to update media');

      const updatedMedia = await response.json();
      onSave(updatedMedia);
      toast.success('Media metadata updated successfully');
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update media:', error);
      toast.error('Failed to update media metadata');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-dark-900">
            Edit Media Metadata
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Preview Thumbnail */}
          <div className="bg-cream-100 rounded-lg p-4">
            <div className="flex items-center space-x-4">
              {media.type === 'image' ? (
                <img
                  src={media.url}
                  alt={formData.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              ) : (
                <div className="w-24 h-24 bg-cream-200 rounded-lg flex items-center justify-center">
                  <svg className="w-12 h-12 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/>
                  </svg>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-dark-900">{media.originalName}</p>
                <p className="text-xs text-dark-500">{media.type.toUpperCase()} • {media.mimeType}</p>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-dark-900 font-medium">
              Title *
            </Label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          {/* Artist (for audio/video) */}
          {(media.type === 'audio' || media.type === 'video') && (
            <div className="space-y-2">
              <Label htmlFor="artist" className="text-dark-900 font-medium">
                Artist / Creator
              </Label>
              <input
                id="artist"
                type="text"
                value={formData.artist}
                onChange={(e) => handleChange('artist', e.target.value)}
                placeholder="Sant Kabir Das"
                className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          )}

          {/* Alt Text (for images) */}
          {media.type === 'image' && (
            <div className="space-y-2">
              <Label htmlFor="altText" className="text-dark-900 font-medium">
                Alt Text (for accessibility)
              </Label>
              <input
                id="altText"
                type="text"
                value={formData.altText}
                onChange={(e) => handleChange('altText', e.target.value)}
                placeholder="Describe the image for screen readers"
                className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <p className="text-xs text-dark-500">
                Helps visually impaired users understand the image content
              </p>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-dark-900 font-medium">
              Description
            </Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Add a description for this media file..."
              rows={4}
              className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags" className="text-dark-900 font-medium">
              Tags
            </Label>
            <input
              id="tags"
              type="text"
              value={formData.tags}
              onChange={(e) => handleChange('tags', e.target.value)}
              placeholder="meditation, spiritual, kabir, doha"
              className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <p className="text-xs text-dark-500">
              Separate tags with commas. Helps with organization and search.
            </p>
          </div>

          {/* Read-only metadata */}
          <div className="bg-cream-50 rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-dark-900 text-sm mb-2">File Information</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {media.metadata?.duration && (
                <div>
                  <span className="text-dark-600">Duration:</span>
                  <span className="ml-2 text-dark-900">{media.metadata.duration}</span>
                </div>
              )}
              {media.metadata?.dimensions && (
                <div>
                  <span className="text-dark-600">Dimensions:</span>
                  <span className="ml-2 text-dark-900">{media.metadata.dimensions}</span>
                </div>
              )}
              {media.metadata?.resolution && (
                <div>
                  <span className="text-dark-600">Resolution:</span>
                  <span className="ml-2 text-dark-900">{media.metadata.resolution}</span>
                </div>
              )}
              <div>
                <span className="text-dark-600">Uploaded:</span>
                <span className="ml-2 text-dark-900">
                  {new Date(media.uploadedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 text-dark-700 bg-cream-200 rounded-lg hover:bg-cream-300 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                  </svg>
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}