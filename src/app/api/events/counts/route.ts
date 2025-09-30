import { NextRequest, NextResponse } from 'next/server';
import { createErrorResponse, getInstancePath, logError } from '@/lib/error-handler';
import { createId } from '@paralleldrive/cuid2';
import { getDatabase } from '@/lib/db';
import { events } from '@/drizzle/schema';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const traceId = createId();
  const instance = getInstancePath(request);

  try {
    const db = await await getDatabase();

    // Get total events count using simple approach
    const allEvents = await db
      .select()
      .from(events);

    const total = allEvents.length;
    const published = allEvents.filter(e => e.published).length;
    const upcoming = allEvents.filter(e => e.published && new Date(e.startDate) >= new Date()).length;
    const satsang = allEvents.filter(e => e.published && e.type === 'satsang' && new Date(e.startDate) >= new Date()).length;
    const festival = allEvents.filter(e => e.published && e.type === 'festival' && new Date(e.startDate) >= new Date()).length;
    const workshop = allEvents.filter(e => e.published && e.type === 'workshop' && new Date(e.startDate) >= new Date()).length;
    const meditation = allEvents.filter(e => e.published && e.type === 'meditation' && new Date(e.startDate) >= new Date()).length;

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
        headers: Object.fromEntries(request.headers.entries()),
      }
    });

    return createErrorResponse('INTERNAL_SERVER_ERROR', {
      instance,
      metadata: { traceId }
    });
  }
}