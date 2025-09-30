import { NextRequest, NextResponse } from 'next/server';
import { databaseService } from '@/lib/database-service';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const overview = await databaseService.getAnalyticsOverview();

    return NextResponse.json(overview);

  } catch (error) {
    console.error('Error fetching analytics overview:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics overview' },
      { status: 500 }
    );
  }
}