import { NextRequest, NextResponse } from 'next/server';
import { databaseService } from '@/lib/database-service';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const upcoming = searchParams.get('upcoming') === 'true';

    // Use the enhanced database service with rich spiritual content
    const result = await databaseService.getEvents(limit, offset, upcoming);

    return NextResponse.json({
      events: result.events,
      total: result.total,
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