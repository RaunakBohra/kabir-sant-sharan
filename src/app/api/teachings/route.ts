import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { teachings } from '../../../drizzle/schema';
import { eq } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';

export const runtime = 'nodejs';

// Helper to generate unique slug
async function generateUniqueSlug(db: any, baseSlug: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await db.select().from(teachings).where(eq(teachings.slug, slug)).limit(1);
    if (existing.length === 0) return slug;
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const status = searchParams.get('status'); // 'published', 'draft', 'all'

    const db = getDatabase();

    let query = db.select().from(teachings);

    if (status === 'published') {
      query = query.where(eq(teachings.published, true));
    } else if (status === 'draft') {
      query = query.where(eq(teachings.published, false));
    }

    const results = await query.limit(limit).offset(offset);
    const totalCount = await db.select().from(teachings);

    return NextResponse.json({
      teachings: results,
      total: totalCount.length,
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
    const body = await request.json() as any;

    // Validate required fields
    const { title, content, excerpt, category } = body;
    if (!title || !content || !excerpt || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: title, content, excerpt, category' },
        { status: 400 }
      );
    }

    const db = getDatabase();

    // Generate slug from title
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    const slug = await generateUniqueSlug(db, baseSlug);

    // Calculate reading time (words per minute: 200)
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    const newTeaching = {
      id: createId(),
      title,
      content,
      excerpt,
      slug,
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
      translationOf: body.translationOf || null,
      deletedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
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