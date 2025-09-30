import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/jwt-auth';

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('accessToken')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'No session found' },
        { status: 401 }
      );
    }

    const payload = verifyAccessToken(accessToken);

    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      user: {
        id: payload.userId,
        sessionId: payload.sessionId
      }
    });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json(
      { error: 'Session verification failed' },
      { status: 401 }
    );
  }
}