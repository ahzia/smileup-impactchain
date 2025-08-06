import { NextRequest, NextResponse } from 'next/server';
import { RewardService } from '@/lib/services/rewardService';
import { AuthMiddleware } from '@/lib/middleware/auth';
import { CreateRewardRequest } from '@/lib/types';

// GET /api/rewards
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'all';
    const provider = searchParams.get('provider') || 'all';
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');

    const rewards = await RewardService.getRewards({
      category,
      provider,
      page,
      pageSize
    });

    return NextResponse.json({
      success: true,
      data: rewards
    });

  } catch (error) {
    console.error('Get rewards error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get rewards' 
      },
      { status: 500 }
    );
  }
}

// POST /api/rewards
export async function POST(request: NextRequest) {
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

    const body: CreateRewardRequest = await request.json();
    const { title, description, type, cost, validity, emoji, imageUrl, communityId } = body;

    // Validate input
    if (!title || !description || !type || cost === undefined || !validity || !emoji || !imageUrl || !communityId) {
      return NextResponse.json(
        { success: false, error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    // Validate cost amount
    if (cost < 0) {
      return NextResponse.json(
        { success: false, error: 'Cost must be non-negative' },
        { status: 400 }
      );
    }

    // Create reward with authenticated user
    const reward = await RewardService.createRewardWithUser(body, userId);

    return NextResponse.json({
      success: true,
      data: {
        reward: {
          id: reward.id,
          title: reward.title
        }
      }
    });

  } catch (error) {
    console.error('Create reward error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create reward' 
      },
      { status: 500 }
    );
  }
} 