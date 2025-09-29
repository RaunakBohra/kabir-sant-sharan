import { NextRequest, NextResponse } from 'next/server';
import { createR2Storage, CloudflareEnv } from '@/lib/r2-storage';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as 'audio' | 'video' | 'image' | 'document';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!type || !['audio', 'video', 'image', 'document'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Must be audio, video, image, or document' },
        { status: 400 }
      );
    }

    // Validate file size (10MB limit for demo)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB' },
        { status: 400 }
      );
    }

    // In production, this would use actual R2 storage
    // For now, return a mock response
    const mockStorageResponse = {
      success: true,
      url: `/api/media/file/${Date.now()}-${file.name}`,
      fileId: Date.now().toString(),
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      uploadedAt: new Date().toISOString()
    };

    return NextResponse.json({
      message: 'File uploaded successfully',
      data: mockStorageResponse
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Mock media files list
    const mockMediaFiles = [
      {
        id: '1',
        fileName: 'kabir-bhajan-1.mp3',
        originalName: 'Kabir Bhajan - Suno Bhai Sadho.mp3',
        url: '/api/media/file/kabir-bhajan-1.mp3',
        type: 'audio',
        size: 5242880, // 5MB
        mimeType: 'audio/mpeg',
        uploadedAt: '2024-09-29T10:00:00Z',
        metadata: {
          title: 'Suno Bhai Sadho',
          artist: 'Traditional',
          duration: '4:32'
        }
      },
      {
        id: '2',
        fileName: 'meditation-video-1.mp4',
        originalName: 'Morning Meditation Guide.mp4',
        url: '/api/media/file/meditation-video-1.mp4',
        type: 'video',
        size: 25165824, // 24MB
        mimeType: 'video/mp4',
        uploadedAt: '2024-09-29T09:00:00Z',
        metadata: {
          title: 'Morning Meditation Guide',
          duration: '15:30',
          resolution: '1920x1080'
        }
      },
      {
        id: '3',
        fileName: 'kabir-portrait.jpg',
        originalName: 'Sant Kabir Portrait.jpg',
        url: '/api/media/file/kabir-portrait.jpg',
        type: 'image',
        size: 1048576, // 1MB
        mimeType: 'image/jpeg',
        uploadedAt: '2024-09-29T08:00:00Z',
        metadata: {
          title: 'Sant Kabir Portrait',
          dimensions: '800x600',
          artist: 'Traditional Art'
        }
      }
    ];

    let filteredFiles = mockMediaFiles;
    if (type) {
      filteredFiles = mockMediaFiles.filter(file => file.type === type);
    }

    const limitedFiles = filteredFiles.slice(0, limit);

    return NextResponse.json({
      files: limitedFiles,
      total: filteredFiles.length,
      limit
    });

  } catch (error) {
    console.error('Media list error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch media files' },
      { status: 500 }
    );
  }
}