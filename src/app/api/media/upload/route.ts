import { NextRequest, NextResponse } from 'next/server';
import { createR2Storage, CloudflareEnv } from '@/lib/r2-storage';

export const runtime = 'nodejs';

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
    const { getDatabase } = await import('@/lib/db');
    const { media } = await import('@/drizzle/schema');
    const { eq, isNull, and, desc } = await import('drizzle-orm');

    const db = getDatabase();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build where conditions
    const conditions = [
      eq(media.published, true),
      isNull(media.deletedAt)
    ];

    if (type) {
      conditions.push(eq(media.type, type));
    }

    // Query media from database
    const results = await db
      .select()
      .from(media)
      .where(and(...conditions))
      .orderBy(desc(media.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count
    const countResult = await db
      .select()
      .from(media)
      .where(and(...conditions));

    // Transform to expected format
    const files = results.map(m => ({
      id: m.id,
      fileName: m.r2Key.split('/').pop() || m.r2Key,
      originalName: m.title,
      url: m.streamingUrl || m.downloadUrl || '',
      type: m.type,
      size: m.fileSize || 0,
      mimeType: m.mimeType || '',
      uploadedAt: m.createdAt || '',
      metadata: {
        title: m.title,
        artist: m.author,
        duration: m.duration || undefined,
        description: m.description
      }
    }));

    return NextResponse.json({
      files,
      total: countResult.length,
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