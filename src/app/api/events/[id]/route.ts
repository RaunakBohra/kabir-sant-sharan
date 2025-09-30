import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { events } from '@/../drizzle/schema';
import { eq } from 'drizzle-orm';

export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getDatabase();
    const event = await db.select().from(events).where(eq(events.id, params.id)).limit(1);

    if (event.length === 0) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ event: event[0] });
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const db = getDatabase();

    const updatedEvent = {
      ...body,
      id: params.id,
      updatedAt: new Date()
    };

    await db.update(events)
      .set(updatedEvent)
      .where(eq(events.id, params.id));

    return NextResponse.json({
      message: 'Event updated successfully',
      event: updatedEvent
    });
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: 'Failed to update event' },
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

    // Check if event exists
    const existingEvent = await db.select().from(events).where(eq(events.id, params.id)).limit(1);

    if (existingEvent.length === 0) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Soft delete by moving to trash
    await db.delete(events).where(eq(events.id, params.id));

    return NextResponse.json({
      message: 'Event deleted successfully',
      id: params.id
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}