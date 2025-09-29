import { NextRequest, NextResponse } from 'next/server';
import { databaseService } from '@/lib/database-service';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Use the enhanced database service with rich spiritual content
    const result = await databaseService.getTeachings(limit, offset);

    return NextResponse.json({
      teachings: result.teachings,
      total: result.total,
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
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // In production, this would save to D1 database
    const newTeaching = {
      id: Date.now().toString(),
      ...body,
      author: body.author || 'Sant Kabir Das',
      published_at: new Date().toISOString(),
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

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