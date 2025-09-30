import { NextRequest, NextResponse } from 'next/server';
import { validateAccessToken } from '@/lib/jwt-auth';
import { databaseService } from '@/lib/database-service';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const category = searchParams.get('category') || 'all';
    const type = searchParams.get('type') || 'all';
    const published = searchParams.get('published') !== 'false';

    const result = await databaseService.getMedia({ limit, offset, category, type, published });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching media:', error);
    return NextResponse.json(
      { error: 'Failed to fetch media' },
      { status: 500 }
    );
  }
}

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
    const { valid } = validateAccessToken(token);

    if (!valid) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description, type, duration, r2Key, streamingUrl, tags, category, published = true, featured = false } = body;

    if (!title || !type || !r2Key || !streamingUrl) {
      return NextResponse.json(
        { error: 'Missing required fields: title, type, r2Key, streamingUrl' },
        { status: 400 }
      );
    }

    const mediaItem = await databaseService.createMedia({
      title,
      description: description || '',
      type,
      duration: duration || null,
      r2Key,
      streamingUrl,
      tags: tags || '',
      category: category || 'uncategorized',
      published: !!published,
      featured: !!featured,
      author: 'Admin',
      uploadedBy: 'admin'
    });

    return NextResponse.json(mediaItem, { status: 201 });
  } catch (error) {
    console.error('Error creating media:', error);
    return NextResponse.json(
      { error: 'Failed to create media' },
      { status: 500 }
    );
  }
}