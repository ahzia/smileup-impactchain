import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/services/authService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { refreshToken } = body;

    // Validate input
    if (!refreshToken) {
      return NextResponse.json(
        { success: false, error: 'Refresh token is required' },
        { status: 400 }
      );
    }

    // Refresh the token
    const result = await AuthService.refreshToken(refreshToken);

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Token refresh failed' 
      },
      { status: 401 }
    );
  }
} 