import { NextRequest, NextResponse } from 'next/server';
import { ChallengeService } from '@/lib/services/challengeService';
import { AuthMiddleware } from '@/lib/middleware/auth';

// POST /api/challenges/[id]/claim
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

    // Claim challenge reward with authenticated user
    const result = await ChallengeService.claimChallengeReward(id, userId);

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Claim challenge error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to claim challenge' 
      },
      { status: 500 }
    );
  }
} 