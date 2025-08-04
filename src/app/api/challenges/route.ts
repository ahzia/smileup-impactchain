import { NextRequest, NextResponse } from 'next/server';
import { ChallengeService } from '@/lib/services/challengeService';

// GET /api/challenges
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');

    const challenges = await ChallengeService.getChallenges({
      type,
      page,
      pageSize
    });

    return NextResponse.json({
      success: true,
      data: challenges
    });

  } catch (error) {
    console.error('Get challenges error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get challenges' 
      },
      { status: 500 }
    );
  }
} 