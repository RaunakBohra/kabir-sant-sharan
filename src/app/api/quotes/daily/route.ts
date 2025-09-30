import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { quotes } from '@/drizzle/schema';
import { eq, isNull, and } from 'drizzle-orm';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const db = getDatabase();

    // Get all active quotes from database
    const allQuotes = await db
      .select()
      .from(quotes)
      .where(and(
        eq(quotes.active, true),
        isNull(quotes.deletedAt)
      ));

    if (allQuotes.length === 0) {
      return NextResponse.json(
        { error: 'No quotes available' },
        { status: 404 }
      );
    }

    // Get current date to select quote
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);

    // Rotate quotes daily based on day of year
    const quoteIndex = dayOfYear % allQuotes.length;
    const selectedQuote = allQuotes[quoteIndex];

    // Transform to match expected format
    const dailyQuote = {
      id: selectedQuote.id,
      text: selectedQuote.content,
      translation: selectedQuote.translation || undefined,
      author: selectedQuote.author,
      language: selectedQuote.language,
      category: selectedQuote.category,
      source: selectedQuote.source || undefined
    };

    return NextResponse.json({
      quote: dailyQuote,
      date: today.toISOString().split('T')[0]
    });

  } catch (error) {
    console.error('Error fetching daily quote:', error);
    return NextResponse.json(
      { error: 'Failed to fetch daily quote' },
      { status: 500 }
    );
  }
}