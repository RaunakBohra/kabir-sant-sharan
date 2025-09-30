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

    // Only update provided fields
    const updateData: any = {};

    // Filter out undefined values and convert dates to ISO strings
    Object.keys(body).forEach(key => {
      if (body[key] !== undefined && key !== 'id') {
        updateData[key] = body[key];
      }
    });

    // Add updated timestamp
    updateData.updatedAt = new Date().toISOString();

    await db.update(events)
      .set(updateData)
      .where(eq(events.id, params.id));

    // Fetch updated event
    const updatedEvent = await db.select().from(events).where(eq(events.id, params.id)).limit(1);

    return NextResponse.json({
      success: true,
      message: 'Event updated successfully',
      event: updatedEvent[0]
    });
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update event' },
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