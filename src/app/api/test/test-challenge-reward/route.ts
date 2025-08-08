import { NextRequest, NextResponse } from 'next/server';
import { AuthMiddleware } from '@/lib/middleware/auth';
import { ChallengeService } from '@/lib/services/challengeService';

export async function POST(req: NextRequest) {
  try {
    const authResult = await AuthMiddleware.requireAuth(req);
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

    const { challengeId } = await req.json();

    if (!challengeId) {
      return NextResponse.json(
        { success: false, error: 'Challenge ID is required' },
        { status: 400 }
      );
    }

    console.log(`🏆 Testing challenge reward claim for user ${userId}, challenge ${challengeId}...`);

    // First, update the challenge to completed status
    await ChallengeService.updateChallengeProgress(challengeId, 'Completed', userId);

    // Then claim the reward
    const result = await ChallengeService.claimChallengeReward(challengeId, userId);

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('❌ Error testing challenge reward:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to test challenge reward' 
      },
      { status: 500 }
    );
  }
} 