import { NextRequest, NextResponse } from 'next/server';
import { FeedService } from '@/lib/services/feedService';
import { AuthMiddleware } from '@/lib/middleware/auth';
import { DonateRequest } from '@/lib/types';

// POST /api/feed/[id]/donate
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate authentication and extract user ID from JWT token
    const authResult = await AuthMiddleware.requireAuth(request);
    
    if (authResult instanceof NextResponse) {
      return authResult; // Return error response
    }

    const userId = AuthMiddleware.getCurrentUserId(authResult);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID not found in token' },
        { status: 401 }
      );
    }

    const { id } = params;
    const body: DonateRequest = await request.json();
    const { amount } = body;

    // Validate donation amount
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Valid donation amount is required' },
        { status: 400 }
      );
    }

    // Donate to feed post with authenticated user
    const result = await FeedService.donateToPost(id, userId, amount);

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Donate to feed error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to donate to feed post' 
      },
      { status: 500 }
    );
  }
} 