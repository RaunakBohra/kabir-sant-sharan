'use client';

import { useState, useRef, useCallback } from 'react';

interface MediaUploadProps {
  onUploadSuccess: () => void;
  onUploadStart: () => void;
  onUploadEnd: () => void;
}

interface UploadProgress {
  [key: string]: number;
}

export function MediaUpload({ onUploadSuccess, onUploadStart, onUploadEnd }: MediaUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({});
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
    'video/mp4',
    'video/webm',
    'video/ogg',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  const maxFileSize = 50 * 1024 * 1024; // 50MB

  const validateFile = (file: File) => {
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`File type ${file.type} is not allowed`);
    }
    if (file.size > maxFileSize) {
      throw new Error(`File size exceeds ${maxFileSize / 1024 / 1024}MB limit`);
    }
  };

  const getFileType = (file: File): 'audio' | 'video' | 'image' | 'document' => {
    if (file.type.startsWith('audio/')) return 'audio';
    if (file.type.startsWith('video/')) return 'video';
    if (file.type.startsWith('image/')) return 'image';
    return 'document';
  };

  const uploadFile = async (file: File) => {
    validateFile(file);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', getFileType(file));

    // Extract metadata if available
    if (file.type.startsWith('image/')) {
      const img = new Image();
      img.onload = () => {
        formData.append('metadata', JSON.stringify({
          dimensions: `${img.width}x${img.height}`,
          resolution: `${img.width}x${img.height}`
        }));
      };
      img.src = URL.createObjectURL(file);
    }

    const xhr = new XMLHttpRequest();

    return new Promise<void>((resolve, reject) => {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded * 100) / e.total);
          setUploadProgress(prev => ({
            ...prev,
            [file.name]: progress
          }));
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[file.name];
            return newProgress;
          });
          resolve();
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });

      xhr.open('POST', '/api/media/upload');
      xhr.send(formData);
    });
  };

  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    setIsUploading(true);
    onUploadStart();

    try {
      for (const file of fileArray) {
        try {
          await uploadFile(file);
        } catch (error) {
          console.error(`Failed to upload ${file.name}:`, error);
          // Continue with other files even if one fails
        }
      }
      onUploadSuccess();
    } finally {
      setIsUploading(false);
      onUploadEnd();
      setUploadProgress({});
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
    // Reset input
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
          isDragOver
            ? 'border-dark-900 bg-dark-50'
            : 'border-cream-300 hover:border-cream-400'
        } ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="space-y-4">
          <div className="flex justify-center">
            <svg className="w-12 h-12 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>

          <div>
            <h3 className="text-lg font-medium text-dark-900 mb-2">
              Upload Media Files
            </h3>
            <p className="text-dark-600 mb-4">
              Drag and drop files here, or click to select files
            </p>

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="bg-dark-900 text-white px-6 py-2 rounded-lg hover:bg-dark-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Select Files
            </button>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,audio/*,video/*,.pdf,.doc,.docx"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          <div className="text-sm text-dark-500">
            <p>Supported formats: Images (JPEG, PNG, WebP, GIF), Audio (MP3, WAV, OGG), Video (MP4, WebM, OGG), Documents (PDF, DOC, DOCX)</p>
            <p>Maximum file size: {formatFileSize(maxFileSize)}</p>
          </div>
        </div>
      </div>

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="bg-cream-50 rounded-lg border border-cream-200 p-4">
          <h4 className="font-medium text-dark-900 mb-3">Uploading Files</h4>
          <div className="space-y-3">
            {Object.entries(uploadProgress).map(([fileName, progress]) => (
              <div key={fileName} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-dark-700 truncate">{fileName}</span>
                  <span className="text-dark-500">{progress}%</span>
                </div>
                <div className="w-full bg-cream-200 rounded-full h-2">
                  <div
                    className="bg-dark-900 h-2 rounded-full transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Guidelines */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex">
          <svg className="w-5 h-5 text-amber-400 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div className="text-sm">
            <h5 className="font-medium text-amber-800 mb-1">Upload Guidelines</h5>
            <ul className="text-amber-700 space-y-1">
              <li>• Use descriptive filenames for better organization</li>
              <li>• Audio files should be in high quality (320kbps recommended)</li>
              <li>• Videos should be optimized for web (H.264/WebM recommended)</li>
              <li>• Images will be automatically optimized for faster loading</li>
              <li>• Files are automatically organized by type</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}