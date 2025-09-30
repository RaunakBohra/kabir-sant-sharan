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

    const result = verifyAccessToken(accessToken);

    if (!result || !result.payload) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    const payload = result.payload;

    return NextResponse.json({
      userId: payload.userId,
      user: {
        id: payload.userId,
        email: payload.email,
        role: payload.role
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