import { NextRequest, NextResponse } from 'next/server';
import { createErrorResponse, getInstancePath, logError } from '@/lib/error-handler';
import { createId } from '@paralleldrive/cuid2';
import { getDatabase } from '@/lib/database';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const traceId = createId();
  const instance = getInstancePath(request);

  try {
    const db = getDatabase();

    // Get counts for each event type
    const [
      totalEvents,
      satsangEvents,
      festivalEvents,
      workshopEvents,
      meditationEvents
    ] = await Promise.all([
      db.prepare('SELECT COUNT(*) as count FROM events WHERE published = ? AND startDate >= date(\'now\')').get(1),
      db.prepare('SELECT COUNT(*) as count FROM events WHERE published = ? AND type = ? AND startDate >= date(\'now\')').get(1, 'satsang'),
      db.prepare('SELECT COUNT(*) as count FROM events WHERE published = ? AND type = ? AND startDate >= date(\'now\')').get(1, 'festival'),
      db.prepare('SELECT COUNT(*) as count FROM events WHERE published = ? AND type = ? AND startDate >= date(\'now\')').get(1, 'workshop'),
      db.prepare('SELECT COUNT(*) as count FROM events WHERE published = ? AND type = ? AND startDate >= date(\'now\')').get(1, 'meditation'),
    ]);

    const counts = {
      all: (totalEvents as any)?.count || 0,
      satsang: (satsangEvents as any)?.count || 0,
      festival: (festivalEvents as any)?.count || 0,
      workshop: (workshopEvents as any)?.count || 0,
      meditation: (meditationEvents as any)?.count || 0,
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