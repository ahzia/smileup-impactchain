import { NextRequest, NextResponse } from 'next/server';
import { AuthMiddleware } from '@/lib/middleware/auth';
import { FeedService } from '@/lib/services/feedService';

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

    const postId = params.id;
    const body = await request.json();
    const { amount = 1, message } = body; // Default to 1 smile if not specified

    // Validate input
    if (!amount || amount < 1) {
      return NextResponse.json(
        { success: false, error: 'Amount must be at least 1 smile' },
        { status: 400 }
      );
    }

    // Process donation
    const result = await FeedService.donateToPost(postId, userId, amount, message);

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: {
          newBalance: result.newBalance,
          newCommunitySmiles: result.newCommunitySmiles,
          donationId: result.donationId,
          message: `Successfully donated ${amount} smile${amount > 1 ? 's' : ''}`
        }
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error || 'Failed to process donation' 
        },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Donation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to process donation' 
      },
      { status: 500 }
    );
  }
} 