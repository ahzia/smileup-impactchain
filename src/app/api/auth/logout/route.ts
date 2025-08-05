import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/services/authService';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Access token required' },
        { status: 401 }
      );
    }

    const accessToken = authHeader.substring(7);

    // Logout user (blacklist token)
    await AuthService.logout(accessToken);

    return NextResponse.json({
      success: true,
      message: 'Successfully logged out'
    });

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Logout failed' 
      },
      { status: 500 }
    );
  }
} 