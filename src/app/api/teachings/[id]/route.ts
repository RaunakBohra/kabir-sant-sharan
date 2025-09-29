import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { teachings } from '../../../../drizzle/schema';
import { eq } from 'drizzle-orm';

export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getDatabase();
    const result = await db.select().from(teachings).where(eq(teachings.id, params.id)).limit(1);

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Teaching not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ teaching: result[0] });

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
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json() as any;
    const db = getDatabase();

    // Check if teaching exists
    const existing = await db.select().from(teachings).where(eq(teachings.id, params.id)).limit(1);
    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Teaching not found' },
        { status: 404 }
      );
    }

    // Calculate reading time if content changed
    let readingTime = existing[0].readingTime;
    if (body.content) {
      const wordCount = body.content.split(/\s+/).length;
      readingTime = Math.ceil(wordCount / 200);
    }

    // Update fields
    const updateData: any = {
      updatedAt: new Date().toISOString()
    };

    if (body.title) updateData.title = body.title;
    if (body.content) updateData.content = body.content;
    if (body.excerpt) updateData.excerpt = body.excerpt;
    if (body.category) updateData.category = body.category;
    if (body.tags !== undefined) updateData.tags = body.tags;
    if (body.author) updateData.author = body.author;
    if (body.published !== undefined) {
      updateData.published = body.published;
      // Set publishedAt when transitioning from draft to published
      if (body.published && !existing[0].publishedAt) {
        updateData.publishedAt = new Date().toISOString();
      }
    }
    if (body.featured !== undefined) updateData.featured = body.featured;
    if (body.language) updateData.language = body.language;
    if (body.coverImage !== undefined) updateData.coverImage = body.coverImage;
    if (body.content) updateData.readingTime = readingTime;

    await db.update(teachings).set(updateData).where(eq(teachings.id, params.id));

    // Fetch updated teaching
    const updated = await db.select().from(teachings).where(eq(teachings.id, params.id)).limit(1);

    return NextResponse.json({
      message: 'Teaching updated successfully',
      teaching: updated[0]
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
  { params }: { params: { id: string } }
) {
  try {
    const db = getDatabase();

    // Check if teaching exists
    const existing = await db.select().from(teachings).where(eq(teachings.id, params.id)).limit(1);
    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Teaching not found' },
        { status: 404 }
      );
    }

    // Soft delete by setting deletedAt
    await db.update(teachings).set({
      deletedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }).where(eq(teachings.id, params.id));

    return NextResponse.json({
      message: 'Teaching deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting teaching:', error);
    return NextResponse.json(
      { error: 'Failed to delete teaching' },
      { status: 500 }
    );
  }
}