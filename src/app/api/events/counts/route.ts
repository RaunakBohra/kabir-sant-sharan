import { NextRequest, NextResponse } from 'next/server';
import { createErrorResponse, getInstancePath, logError } from '@/lib/error-handler';
import { createId } from '@paralleldrive/cuid2';
import { getDatabase } from '@/lib/db';
import { events } from '@/drizzle/schema';
import { eq, and, isNull, gte, sql as drizzleSql, count } from 'drizzle-orm';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const traceId = createId();
  const instance = getInstancePath(request);

  try {
    const db = getDatabase();

    // Get total events count
    const totalResult = await db
      .select({ count: count(events.id) })
      .from(events)
      .where(isNull(events.deletedAt));
    const total = (totalResult[0] as any)?.count || 0;

    // Get published events count
    const publishedResult = await db
      .select({ count: count(events.id) })
      .from(events)
      .where(and(
        eq(events.published, true),
        isNull(events.deletedAt)
      ));
    const published = (publishedResult[0] as any)?.count || 0;

    // Get upcoming published events count
    const upcomingResult = await db
      .select({ count: count(events.id) })
      .from(events)
      .where(and(
        eq(events.published, true),
        gte(events.startDate, drizzleSql`date('now')`),
        isNull(events.deletedAt)
      ));
    const upcoming = (upcomingResult[0] as any)?.count || 0;

    // Get counts by type
    const satsangResult = await db
      .select({ count: count(events.id) })
      .from(events)
      .where(and(
        eq(events.published, true),
        eq(events.type, 'satsang'),
        gte(events.startDate, drizzleSql`date('now')`),
        isNull(events.deletedAt)
      ));
    const satsang = (satsangResult[0] as any)?.count || 0;

    const festivalResult = await db
      .select({ count: count(events.id) })
      .from(events)
      .where(and(
        eq(events.published, true),
        eq(events.type, 'festival'),
        gte(events.startDate, drizzleSql`date('now')`),
        isNull(events.deletedAt)
      ));
    const festival = (festivalResult[0] as any)?.count || 0;

    const workshopResult = await db
      .select({ count: count(events.id) })
      .from(events)
      .where(and(
        eq(events.published, true),
        eq(events.type, 'workshop'),
        gte(events.startDate, drizzleSql`date('now')`),
        isNull(events.deletedAt)
      ));
    const workshop = (workshopResult[0] as any)?.count || 0;

    const meditationResult = await db
      .select({ count: count(events.id) })
      .from(events)
      .where(and(
        eq(events.published, true),
        eq(events.type, 'meditation'),
        gte(events.startDate, drizzleSql`date('now')`),
        isNull(events.deletedAt)
      ));
    const meditation = (meditationResult[0] as any)?.count || 0;

    const counts = {
      total,
      published,
      upcoming,
      satsang,
      festival,
      workshop,
      meditation,
    };

    const headers = {
      'Content-Type': 'application/json',
      'X-Trace-ID': traceId,
      'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
    };

    return NextResponse.json(counts, { headers });

  } catch (error) {
    logError(error as Error, {
      traceId,
      request: {
        method: request.method,
        url: request.url,
      }
    });

    return createErrorResponse('INTERNAL_SERVER_ERROR', {
      instance,
      metadata: { traceId }
    });
  }
}