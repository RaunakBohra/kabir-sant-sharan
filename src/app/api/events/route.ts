import { NextRequest, NextResponse } from 'next/server';
import { databaseService } from '@/lib/database-service';

export const runtime = 'nodejs';

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
    const { title, description, type, startDate, startTime } = body;
    if (!title || !description || !type || !startDate || !startTime) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, type, startDate, startTime' },
        { status: 400 }
      );
    }

    // Transform form data to database format
    const eventDate = new Date(`${startDate}T${startTime}`).toISOString();
    const eventId = Date.now().toString();

    const newEvent = {
      id: eventId,
      title: body.title,
      description: body.description,
      location: body.location || 'Virtual',
      virtualLink: body.virtualLink || null,
      startDate: startDate,
      endDate: body.endDate || startDate,
      startTime: startTime,
      endTime: body.endTime || startTime,
      timezone: body.timezone || 'Asia/Kathmandu',
      type: type,
      category: body.category || 'meditation',
      tags: JSON.stringify(Array.isArray(body.tags) ? body.tags : (body.tags ? [body.tags] : [])),
      organizer: body.organizer || 'Kabir Sant Sharan',
      language: body.language || 'en',
      maxAttendees: body.maxAttendees || null,
      currentAttendees: body.currentAttendees || 0,
      registrationRequired: body.registrationRequired || false,
      registrationDeadline: body.registrationDeadline || null,
      featured: body.featured || false,
      published: body.published || false,
      coverImage: body.coverImage || null,
      slug: body.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save to database
    const { getDatabase } = await import('@/lib/db');
    const { events } = await import('@/../drizzle/schema');
    const db = getDatabase();

    await db.insert(events).values(newEvent);

    return NextResponse.json({
      message: 'Event created successfully',
      event: newEvent
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Failed to create event', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}