import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { gte, desc } from 'drizzle-orm';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const upcoming = searchParams.get('upcoming') === 'true';

    // Mock events data for now
    const mockEvents = [
      {
        id: '1',
        title: 'Daily Satsang - Morning Meditation',
        description: 'Join us for daily morning meditation and spiritual discourse based on Sant Kabir\'s teachings.',
        location: 'Community Hall, Kabir Ashram',
        event_date: '2024-10-01T06:00:00Z',
        event_type: 'meditation',
        is_featured: true,
        registration_required: false,
        max_attendees: 100,
        current_attendees: 45,
        created_at: '2024-09-29T10:00:00Z',
        updated_at: '2024-09-29T10:00:00Z'
      },
      {
        id: '2',
        title: 'Kabir Jayanti Celebration',
        description: 'Annual celebration of Sant Kabir\'s birth anniversary with special programs and community feast.',
        location: 'Main Temple Complex',
        event_date: '2024-10-15T09:00:00Z',
        event_type: 'festival',
        is_featured: true,
        registration_required: true,
        max_attendees: 500,
        current_attendees: 234,
        created_at: '2024-09-29T10:00:00Z',
        updated_at: '2024-09-29T10:00:00Z'
      },
      {
        id: '3',
        title: 'Weekly Bhajan Session',
        description: 'Community singing of devotional songs and Kabir\'s dohas with musical accompaniment.',
        location: 'Music Hall',
        event_date: '2024-10-05T18:00:00Z',
        event_type: 'music',
        is_featured: false,
        registration_required: false,
        max_attendees: 75,
        current_attendees: 32,
        created_at: '2024-09-29T10:00:00Z',
        updated_at: '2024-09-29T10:00:00Z'
      }
    ];

    let filteredEvents = mockEvents;

    if (upcoming) {
      const now = new Date().toISOString();
      filteredEvents = mockEvents.filter(event => event.event_date > now);
    }

    const paginatedEvents = filteredEvents.slice(offset, offset + limit);

    return NextResponse.json({
      events: paginatedEvents,
      total: filteredEvents.length,
      limit,
      offset
    });

  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as any;

    // Validate required fields
    const { title, description, location, event_date, event_type } = body;
    if (!title || !description || !location || !event_date || !event_type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // In production, this would save to D1 database
    const newEvent = {
      id: Date.now().toString(),
      ...body,
      current_attendees: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return NextResponse.json({
      message: 'Event created successfully',
      event: newEvent
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}