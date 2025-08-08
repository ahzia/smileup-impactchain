import { NextRequest, NextResponse } from 'next/server';
import { CommunityService } from '@/lib/services/communityService';
import { AuthMiddleware } from '@/lib/middleware/auth';

// POST /api/communities/[id]/join
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params;

    // Join community with authenticated user
    const community = await CommunityService.joinCommunity(id, userId);

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