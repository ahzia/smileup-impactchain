import { NextRequest, NextResponse } from 'next/server';
import { FeedService } from '@/lib/services/feedService';
import { AuthMiddleware } from '@/lib/middleware/auth';

// POST /api/feed/[id]/donate
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('🎯 Donation API called');
    
    // Validate authentication and extract user ID from JWT token
    const authResult = await AuthMiddleware.requireAuth(request);
    
    if (authResult instanceof NextResponse) {
      console.log('❌ Authentication failed');
      return authResult; // Return error response
    }

    const userId = AuthMiddleware.getCurrentUserId(authResult);
    if (!userId) {
      console.log('❌ User ID not found in token');
      return NextResponse.json(
        { success: false, error: 'User ID not found in token' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const { amount } = await request.json();

    console.log('📋 Donation details:');
    console.log('- Post ID:', id);
    console.log('- User ID:', userId);
    console.log('- Amount:', amount);

    // Donate to post with authenticated user
    console.log('🔄 Calling FeedService.donateToPost...');
    const result = await FeedService.donateToPost(id, userId, amount);
    console.log('✅ FeedService.donateToPost result:', result);

    if (!result.success) {
      console.log('❌ Donation failed:', result.error);
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    console.log('🎉 Donation successful!');
    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('❌ Donate to post error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to donate to post' 
      },
      { status: 500 }
    );
  }
} 