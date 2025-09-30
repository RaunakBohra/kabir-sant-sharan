import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { events } from '@/../drizzle/schema';
import { eq } from 'drizzle-orm';

export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDatabase();
    const event = await db.select().from(events).where(eq(events.id, id)).limit(1);

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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const db = getDatabase();

    // Only update provided fields
    const updateData: any = {};

    // Filter out undefined values and convert dates to ISO strings
    Object.keys(body as Record<string, any>).forEach(key => {
      if ((body as Record<string, any>)[key] !== undefined && key !== 'id') {
        updateData[key] = (body as Record<string, any>)[key];
      }
    });

    // Add updated timestamp
    updateData.updatedAt = new Date().toISOString();

    await db.update(events)
      .set(updateData)
      .where(eq(events.id, id));

    // Fetch updated event
    const updatedEvent = await db.select().from(events).where(eq(events.id, id)).limit(1);

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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDatabase();

    // Check if event exists
    const existingEvent = await db.select().from(events).where(eq(events.id, id)).limit(1);

    if (existingEvent.length === 0) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Soft delete by moving to trash
    await db.delete(events).where(eq(events.id, id));

    return NextResponse.json({
      message: 'Event deleted successfully',
      id: id
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}