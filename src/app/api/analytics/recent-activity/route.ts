import { NextRequest, NextResponse } from 'next/server';
import { databaseService } from '@/lib/database-service';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    const recentActivity = await databaseService.getRecentActivity(limit);

    return NextResponse.json({ recentActivity });

  } catch (error) {
    console.error('Error fetching recent activity:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent activity' },
      { status: 500 }
    );
  }
}