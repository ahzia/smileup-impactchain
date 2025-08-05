import { NextRequest, NextResponse } from 'next/server';
import { RewardService } from '@/lib/services/rewardService';
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
    // In real app, validate JWT token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Authorization token required' },
        { status: 401 }
      );
    }

    const body: CreateRewardRequest = await request.json();
    const { title, description, type, cost, validity, emoji, imageUrl, communityId } = body;

    // Validate input
    if (!title || !description || !type || !cost || !validity || !emoji || !imageUrl || !communityId) {
      return NextResponse.json(
        { success: false, error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    // Validate cost
    if (cost < 0) {
      return NextResponse.json(
        { success: false, error: 'Cost must be non-negative' },
        { status: 400 }
      );
    }

    // For mock implementation, use a default user ID
    const userId = 'user_001';

    // Create reward
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