import { NextRequest, NextResponse } from 'next/server';
import { RewardService } from '@/lib/services/rewardService';
import { AuthMiddleware } from '@/lib/middleware/auth';

// POST /api/rewards/[id]/redeem
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

    // Redeem reward with authenticated user
    const result = await RewardService.redeemReward(id, userId);

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Redeem reward error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to redeem reward' 
      },
      { status: 500 }
    );
  }
} 