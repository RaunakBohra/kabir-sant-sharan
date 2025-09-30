import { NextRequest, NextResponse } from 'next/server';
import { databaseService } from '@/lib/database-service';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') as 'teaching' | 'event' | undefined;
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!query.trim()) {
      return NextResponse.json({
        results: [],
        total: 0,
        query: ''
      });
    }

    // Use the database service to search content
    const searchResults = await databaseService.searchContent(query, type);

    // Format results for the search component
    const formattedResults = [
      ...searchResults.teachings.slice(0, limit).map(teaching => ({
        id: teaching.id,
        title: teaching.title,
        content: teaching.excerpt,
        type: 'teaching' as const,
        slug: teaching.slug,
        url: `/teachings/${teaching.id}`,
        tags: teaching.tags,
        category: teaching.category
      })),
      ...searchResults.events.slice(0, limit).map(event => ({
        id: event.id,
        title: event.title,
        content: event.description,
        type: 'event' as const,
        url: '/events',
        eventType: event.type,
        date: event.startDate,
        location: event.location
      }))
    ];

    return NextResponse.json({
      results: formattedResults.slice(0, limit),
      total: formattedResults.length,
      query,
      teachings_count: searchResults.teachings.length,
      events_count: searchResults.events.length
    });

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}