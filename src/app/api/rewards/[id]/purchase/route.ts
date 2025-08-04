import { NextRequest, NextResponse } from 'next/server';
import { RewardService } from '@/lib/services/rewardService';

// POST /api/rewards/[id]/purchase
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const rewardId = params.id;

    // In real app, validate JWT token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Authorization token required' },
        { status: 401 }
      );
    }

    // For mock implementation, use a default user ID
    const userId = 'user_001';

    // Purchase reward (using redeemReward method)
    const result = await RewardService.redeemReward(rewardId, userId);

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Purchase reward error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to purchase reward' 
      },
      { status: 500 }
    );
  }
} 