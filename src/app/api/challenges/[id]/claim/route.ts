import { NextRequest, NextResponse } from 'next/server';
import { ChallengeService } from '@/lib/services/challengeService';

// POST /api/challenges/[id]/claim
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

    // Claim challenge reward
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