import { NextRequest, NextResponse } from 'next/server';
import { databaseService } from '@/lib/database-service';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    const topPages = await databaseService.getTopPages(limit);

    return NextResponse.json({ topPages });

  } catch (error) {
    console.error('Error fetching top pages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch top pages' },
      { status: 500 }
    );
  }
}