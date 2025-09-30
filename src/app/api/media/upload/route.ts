import { NextRequest, NextResponse } from 'next/server';
import { createR2UploadService } from '@/lib/r2-upload';
import { databaseService } from '@/lib/database-service';
import { validateAccessToken } from '@/lib/jwt-auth';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    // Validate authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const { valid, payload } = validateAccessToken(token);

    if (!valid || !payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as 'audio' | 'video' | 'image' | 'document';
    const metadataStr = formData.get('metadata') as string | null;

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

    // Validate file size (200MB limit to match client-side)
    const maxSize = 200 * 1024 * 1024; // 200MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 200MB' },
        { status: 400 }
      );
    }

    // Parse metadata if provided
    let metadata: Record<string, string> = {};
    if (metadataStr) {
      try {
        metadata = JSON.parse(metadataStr);
      } catch (e) {
        console.warn('Failed to parse metadata:', e);
      }
    }

    // Initialize R2 upload service
    const r2Service = createR2UploadService();

    // Generate unique key for the file
    const r2Key = r2Service.generateKey(file.name, type);

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to R2
    const uploadResult = await r2Service.uploadFile(
      buffer,
      r2Key,
      file.type,
      metadata
    );

    if (!uploadResult.success) {
      return NextResponse.json(
        { error: uploadResult.error || 'Upload failed' },
        { status: 500 }
      );
    }

    // Save to database
    const mediaItem = await databaseService.createMedia({
      title: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
      description: metadata.description || '',
      type: type,
      category: metadata.category || 'uncategorized',
      tags: metadata.tags || '',
      author: metadata.author || 'Admin',
      duration: metadata.duration || undefined,
      fileSize: file.size,
      mimeType: file.type,
      r2Key: r2Key,
      r2Bucket: process.env.R2_BUCKET_NAME || 'kabir-media',
      thumbnailKey: undefined,
      streamingUrl: uploadResult.url!,
      downloadUrl: uploadResult.url!,
      transcription: undefined,
      featured: false,
      published: false, // Default to unpublished, admin can publish later
      language: 'en',
      uploadedBy: payload.userId,
    });

    return NextResponse.json({
      message: 'File uploaded successfully',
      data: {
        id: mediaItem.id,
        url: uploadResult.url,
        key: r2Key,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        type: type,
        uploadedAt: mediaItem.createdAt
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload file' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { getDatabase } = await import('@/lib/db');
    const { media } = await import('@/drizzle/schema');
    const { eq, isNull, and, desc } = await import('drizzle-orm');

    const db = await await getDatabase();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const published = searchParams.get('published');

    // Build where conditions
    const conditions = [
      isNull(media.deletedAt)
    ];

    // Only filter by published status if specifically requested
    if (published === 'true') {
      conditions.push(eq(media.published, true));
    } else if (published === 'false') {
      conditions.push(eq(media.published, false));
    }
    // If published is null/undefined, show all (for admin)

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