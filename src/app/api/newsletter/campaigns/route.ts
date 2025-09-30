import { NextRequest, NextResponse } from 'next/server';
import { databaseService } from '@/lib/database-service';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const result = await databaseService.getNewsletterCampaigns(limit, offset);

    return NextResponse.json({
      campaigns: result.campaigns,
      total: result.total,
      limit,
      offset
    });

  } catch (error) {
    console.error('Error fetching newsletter campaigns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as any;

    const { subject, content, segment, status } = body;
    if (!subject || !content) {
      return NextResponse.json(
        { error: 'Subject and content are required' },
        { status: 400 }
      );
    }

    // Calculate recipients based on segment
    const { subscribers } = await databaseService.getNewsletterSubscribers(1000, 0);
    let recipientCount = 0;

    if (segment === 'all') {
      recipientCount = subscribers.filter(s => s.isActive).length;
    } else {
      recipientCount = subscribers.filter(s =>
        s.isActive && s.preferences[segment as keyof typeof s.preferences]
      ).length;
    }

    const newCampaign = await databaseService.createNewsletterCampaign({
      subject,
      content,
      segment: segment || 'all',
      status: status || 'draft',
      recipients: status === 'sent' ? recipientCount : 0
    });

    return NextResponse.json({
      message: status === 'sent' ? 'Campaign sent successfully' : 'Campaign created as draft',
      campaign: newCampaign
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating newsletter campaign:', error);
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    );
  }
}