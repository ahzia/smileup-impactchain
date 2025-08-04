import { NextRequest, NextResponse } from 'next/server';
import { RewardService } from '@/lib/services/rewardService';

// POST /api/rewards/[id]/redeem
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // In real app, validate JWT token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Authorization token required' },
        { status: 401 }
      );
    }

    const { id } = params;

    // For mock implementation, use a default user ID
    const userId = 'user_001';

    // Redeem reward
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