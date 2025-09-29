import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { eq, desc } from 'drizzle-orm';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    // In production, this will use the actual D1 database
    // For now, return mock data for the frontend to work
    const mockTeachings = [
      {
        id: '1',
        title: 'The Path of Divine Love',
        content: 'Sant Kabir teaches us that the path to the divine is through pure love and devotion...',
        excerpt: 'Discover the essence of divine love through Sant Kabir\'s timeless wisdom.',
        author: 'Sant Kabir Das',
        published_at: '2024-09-29T10:00:00Z',
        category: 'Philosophy',
        tags: ['love', 'devotion', 'spirituality'],
        featured_image: '/images/divine-love.jpg',
        slug: 'path-of-divine-love',
        created_at: '2024-09-29T10:00:00Z',
        updated_at: '2024-09-29T10:00:00Z'
      },
      {
        id: '2',
        title: 'Unity in Diversity',
        content: 'All paths lead to the same divine source. Whether Hindu, Muslim, or any faith...',
        excerpt: 'Understanding the universal message of unity beyond religious boundaries.',
        author: 'Sant Kabir Das',
        published_at: '2024-09-28T10:00:00Z',
        category: 'Unity',
        tags: ['unity', 'religion', 'peace'],
        featured_image: '/images/unity.jpg',
        slug: 'unity-in-diversity',
        created_at: '2024-09-28T10:00:00Z',
        updated_at: '2024-09-28T10:00:00Z'
      }
    ];

    const paginatedTeachings = mockTeachings.slice(offset, offset + limit);

    return NextResponse.json({
      teachings: paginatedTeachings,
      total: mockTeachings.length,
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