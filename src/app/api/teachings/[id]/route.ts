import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { teachings } from '@/drizzle/schema';
import { eq, and, isNull } from 'drizzle-orm';

export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDatabase();

    const results = await db
      .select()
      .from(teachings)
      .where(and(
        eq(teachings.id, id),
        isNull(teachings.deletedAt)
      ))
      .limit(1);

    if (results.length === 0) {
      return NextResponse.json(
        { error: 'Teaching not found' },
        { status: 404 }
      );
    }

    const teaching = results[0];

    // Transform to expected format
    return NextResponse.json({
      id: teaching.id,
      title: teaching.title,
      content: teaching.content,
      excerpt: teaching.excerpt,
      author: teaching.author,
      published_at: teaching.publishedAt || teaching.createdAt || '',
      category: teaching.category,
      tags: teaching.tags ? teaching.tags.split(',').map(t => t.trim()) : [],
      featured_image: teaching.coverImage || undefined,
      slug: teaching.slug,
      created_at: teaching.createdAt || '',
      updated_at: teaching.updatedAt || ''
    });
  } catch (error) {
    console.error('Error fetching teaching:', error);
    return NextResponse.json(
      { error: 'Failed to fetch teaching' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDatabase();
    const body = await request.json();

    // Validate required fields
    const { title, content, excerpt, category } = body;
    if (!title || !content || !excerpt || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: title, content, excerpt, category' },
        { status: 400 }
      );
    }

    // Check if teaching exists
    const existing = await db
      .select()
      .from(teachings)
      .where(and(
        eq(teachings.id, id),
        isNull(teachings.deletedAt)
      ))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Teaching not found' },
        { status: 404 }
      );
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // Calculate reading time (words per minute = 200)
    const readingTime = Math.ceil(content.split(/\s+/).length / 200);

    // Prepare update data
    const updateData: any = {
      title,
      content,
      excerpt,
      slug,
      category,
      readingTime,
      updatedAt: new Date().toISOString()
    };

    // Optional fields
    if (body.tags) {
      updateData.tags = Array.isArray(body.tags) ? body.tags.join(',') : body.tags;
    }
    if (body.author) updateData.author = body.author;
    if (body.published !== undefined) {
      updateData.published = body.published;
      // Set publishedAt if publishing for the first time
      if (body.published && !existing[0].publishedAt) {
        updateData.publishedAt = new Date().toISOString();
      }
    }
    if (body.featured !== undefined) updateData.featured = body.featured;
    if (body.language) updateData.language = body.language;
    if (body.coverImage !== undefined) updateData.coverImage = body.coverImage;

    // Update the teaching
    await db
      .update(teachings)
      .set(updateData)
      .where(eq(teachings.id, id));

    // Fetch updated teaching
    const updated = await db
      .select()
      .from(teachings)
      .where(eq(teachings.id, id))
      .limit(1);

    const teaching = updated[0];

    return NextResponse.json({
      message: 'Teaching updated successfully',
      teaching: {
        id: teaching.id,
        title: teaching.title,
        content: teaching.content,
        excerpt: teaching.excerpt,
        author: teaching.author,
        published_at: teaching.publishedAt || teaching.createdAt || '',
        category: teaching.category,
        tags: teaching.tags ? teaching.tags.split(',').map(t => t.trim()) : [],
        featured_image: teaching.coverImage || undefined,
        slug: teaching.slug,
        created_at: teaching.createdAt || '',
        updated_at: teaching.updatedAt || ''
      }
    });
  } catch (error) {
    console.error('Error updating teaching:', error);
    return NextResponse.json(
      { error: 'Failed to update teaching' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDatabase();

    // Check if teaching exists first
    const existing = await db
      .select()
      .from(teachings)
      .where(and(
        eq(teachings.id, id),
        isNull(teachings.deletedAt)
      ))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Teaching not found' },
        { status: 404 }
      );
    }

    // Soft delete: set deletedAt timestamp
    await db
      .update(teachings)
      .set({
        deletedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .where(eq(teachings.id, id));

    return NextResponse.json({
      message: 'Teaching deleted successfully',
      id: id
    });
  } catch (error) {
    console.error('Error deleting teaching:', error);
    return NextResponse.json(
      { error: 'Failed to delete teaching' },
      { status: 500 }
    );
  }
}