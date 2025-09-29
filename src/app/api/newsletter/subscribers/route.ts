import { NextRequest, NextResponse } from 'next/server';
import { databaseService } from '@/lib/database-service';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    const result = await databaseService.getNewsletterSubscribers(limit, offset);

    return NextResponse.json({
      subscribers: result.subscribers,
      total: result.total,
      limit,
      offset
    });

  } catch (error) {
    console.error('Error fetching newsletter subscribers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscribers' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as any;

    const { email, name, preferences } = body;
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const newSubscriber = await databaseService.addNewsletterSubscriber(
      email,
      name,
      preferences
    );

    return NextResponse.json({
      message: 'Subscriber added successfully',
      subscriber: newSubscriber
    }, { status: 201 });

  } catch (error) {
    console.error('Error adding newsletter subscriber:', error);
    return NextResponse.json(
      { error: 'Failed to add subscriber' },
      { status: 500 }
    );
  }
}