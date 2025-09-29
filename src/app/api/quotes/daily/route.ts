import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

// Mock quotes - in production, fetch from D1 database
const quotes = [
  {
    id: '1',
    text: 'जो खोजा तिन पाइया, गहरे पानी पैठ। मैं बपुरा बूडन डरा, रहा किनारे बैठ।',
    author: 'Sant Kabir Das',
    language: 'ne',
    category: 'wisdom'
  },
  {
    id: '2',
    text: 'माला फेरत जुग भया, फिरा न मन का फेर। कर का मन का डार दे, मन का मन का फेर।',
    author: 'Sant Kabir Das',
    language: 'ne',
    category: 'meditation'
  },
  {
    id: '3',
    text: 'The truth is one, but the wise call it by many names. Seek within yourself, for that is where the divine resides.',
    author: 'Sant Kabir Das',
    language: 'en',
    category: 'truth'
  },
  {
    id: '4',
    text: 'Love is the bridge between two hearts, and the divine is the river that flows beneath.',
    author: 'Sant Kabir Das',
    language: 'en',
    category: 'devotion'
  },
  {
    id: '5',
    text: 'दो कोस प्यार के, ना मिल तो क्या गम? मन दीपक जलाइए, यदि सुमिरन केर नाम।',
    author: 'Sant Kabir Das',
    language: 'ne',
    category: 'devotion'
  },
  {
    id: '6',
    text: 'प्रेम गली अति सांकरी, ता में दो न समाहिं। जब मैं था तब हरि नहीं, अब हरि हैं मैं नाहिं॥',
    author: 'Sant Kabir Das',
    language: 'ne',
    category: 'wisdom'
  }
];

export async function GET(request: NextRequest) {
  try {
    // Get current date to select quote
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);

    // Rotate quotes daily
    const quoteIndex = dayOfYear % quotes.length;
    const dailyQuote = quotes[quoteIndex];

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