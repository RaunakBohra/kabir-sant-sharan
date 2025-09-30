import { NextRequest, NextResponse } from 'next/server';
import { databaseService } from '@/lib/database-service';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured') === 'true';

    // Use the enhanced database service with rich spiritual content
    const result = await databaseService.getTeachings(limit, offset);

    // Apply client-side filtering for now
    let filteredTeachings = result.teachings;

    if (category && category !== 'all') {
      filteredTeachings = filteredTeachings.filter(t =>
        t.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredTeachings = filteredTeachings.filter(t =>
        t.title.toLowerCase().includes(searchLower) ||
        t.content.toLowerCase().includes(searchLower) ||
        t.excerpt.toLowerCase().includes(searchLower)
      );
    }

    if (featured) {
      // Assuming first 2 teachings are featured for now
      filteredTeachings = filteredTeachings.slice(0, 2);
    }

    return NextResponse.json({
      teachings: filteredTeachings,
      total: filteredTeachings.length,
      limit,
      offset
    });

  } catch (error) {
    console.error('Error fetching teachings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch teachings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { getDatabase } = await import('@/lib/db');
    const { teachings } = await import('@/drizzle/schema');
    const { createId } = await import('@paralleldrive/cuid2');

    const body = await request.json() as any;

    // Validate required fields
    const { title, content, excerpt, category } = body;
    if (!title || !content || !excerpt || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: title, content, excerpt, category' },
        { status: 400 }
      );
    }

    const db = await await getDatabase();

    // Generate slug from title
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // Calculate reading time (words per minute: 200)
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    const newTeaching = {
      id: createId(),
      title,
      content,
      excerpt,
      slug: baseSlug,
      category,
      tags: body.tags || null,
      author: body.author || 'Sant Kabir Das',
      published: body.published || false,
      featured: body.featured || false,
      language: body.language || 'en',
      coverImage: body.coverImage || null,
      readingTime,
      publishedAt: body.published ? new Date().toISOString() : null,
      views: 0,
      likes: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      translationOf: null,
      deletedAt: null
    };

    await db.insert(teachings).values(newTeaching);

    return NextResponse.json({
      message: 'Teaching created successfully',
      teaching: newTeaching
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating teaching:', error);
    return NextResponse.json(
      { error: 'Failed to create teaching' },
      { status: 500 }
    );
  }
}