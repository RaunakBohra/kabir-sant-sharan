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

    // In production, this would save to D1 database
    const newEvent = {
      id: Date.now().toString(),
      title: body.title,
      description: body.description,
      location: body.location || '',
      virtual_link: body.virtualLink || null,
      event_date: eventDate,
      start_date: startDate,
      end_date: body.endDate,
      start_time: startTime,
      end_time: body.endTime,
      timezone: body.timezone || 'Asia/Kathmandu',
      event_type: type,
      category: body.category,
      tags: Array.isArray(body.tags) ? body.tags : [],
      organizer: body.organizer || 'Kabir Sant Sharan',
      language: body.language || 'en',
      max_attendees: body.maxAttendees || null,
      current_attendees: body.currentAttendees || 0,
      registration_required: body.registrationRequired || false,
      registration_deadline: body.registrationDeadline || null,
      is_featured: body.featured || false,
      is_published: body.published || false,
      cover_image: body.coverImage || null,
      slug: body.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
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
      { error: 'Failed to create event', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}