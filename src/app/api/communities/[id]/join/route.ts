import { NextRequest, NextResponse } from 'next/server';
import { CommunityService } from '@/lib/services/communityService';
import { AuthService } from '@/lib/services/authService';

// POST /api/communities/[id]/join
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

    // Join community
    const community = await CommunityService.joinCommunity(id, userId);

    // Update user's communities list
    await AuthService.joinCommunity(userId, id);

    return NextResponse.json({
      success: true,
      data: {
        community: {
          id: community.id,
          status: 'joined'
        }
      }
    });

  } catch (error) {
    console.error('Join community error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to join community' 
      },
      { status: 500 }
    );
  }
} 