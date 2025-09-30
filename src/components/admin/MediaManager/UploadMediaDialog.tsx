'use client';

import { useState, useRef, useCallback } from 'react';
import { toast } from '@/components/ui/toast';

interface UploadMediaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadSuccess: () => void;
}

interface UploadProgress {
  [key: string]: number;
}

export function UploadMediaDialog({ open, onOpenChange, onUploadSuccess }: UploadMediaDialogProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({});
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allowedTypes = ['image/*', 'audio/*', 'video/*', 'application/pdf'];
  const maxFileSize = 200 * 1024 * 1024; // 200MB

  const getFileType = (file: File): 'audio' | 'video' | 'image' | 'document' => {
    if (file.type.startsWith('audio/')) return 'audio';
    if (file.type.startsWith('video/')) return 'video';
    if (file.type.startsWith('image/')) return 'image';
    return 'document';
  };

  const uploadFile = async (file: File) => {
    if (file.size > maxFileSize) {
      throw new Error(`File too large. Max: 200MB`);
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', getFileType(file));

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      throw new Error('Please log in again');
    }

    const xhr = new XMLHttpRequest();

    return new Promise<void>((resolve, reject) => {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded * 100) / e.total);
          setUploadProgress(prev => ({ ...prev, [file.name]: progress }));
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200 || xhr.status === 201) {
          setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[file.name];
            return newProgress;
          });
          resolve();
        } else {
          const errorText = xhr.responseText ? JSON.parse(xhr.responseText).error : 'Upload failed';
          reject(new Error(errorText));
        }
      });

      xhr.addEventListener('error', () => reject(new Error('Upload failed')));

      xhr.open('POST', '/api/media/upload');
      xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
      xhr.send(formData);
    });
  };

  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    setIsUploading(true);

    let successCount = 0;
    let failCount = 0;

    for (const file of fileArray) {
      try {
        await uploadFile(file);
        successCount++;
      } catch (error) {
        console.error(`Failed: ${file.name}`, error);
        failCount++;
      }
    }

    setIsUploading(false);
    setUploadProgress({});

    if (successCount > 0) {
      toast.success(`${successCount} file(s) uploaded successfully`);
      onUploadSuccess();
      onOpenChange(false);
    }
    if (failCount > 0) {
      toast.error(`${failCount} file(s) failed to upload`);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-cream-200">
          <h2 className="text-xl font-bold text-dark-900">Upload Media</h2>
          <button
            onClick={() => onOpenChange(false)}
            disabled={isUploading}
            className="p-2 text-dark-600 hover:text-dark-900 hover:bg-cream-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver ? 'border-dark-900 bg-dark-50' : 'border-cream-300'
            } ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <svg className="w-12 h-12 text-dark-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>

            <p className="text-dark-600 mb-4">Drag files here or click to select</p>

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="bg-dark-900 text-white px-6 py-2 rounded-lg hover:bg-dark-800 transition-colors disabled:opacity-50"
            >
              Select Files
            </button>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,audio/*,video/*,.pdf"
              onChange={handleFileSelect}
              className="hidden"
            />

            <p className="text-xs text-dark-500 mt-4">
              Images, Audio, Video, PDF • Max 200MB
            </p>
          </div>

          {/* Upload Progress */}
          {Object.keys(uploadProgress).length > 0 && (
            <div className="space-y-2">
              {Object.entries(uploadProgress).map(([fileName, progress]) => (
                <div key={fileName} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-dark-700 truncate flex-1">{fileName}</span>
                    <span className="text-dark-500 ml-2">{progress}%</span>
                  </div>
                  <div className="w-full bg-cream-200 rounded-full h-2">
                    <div
                      className="bg-dark-900 h-2 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}