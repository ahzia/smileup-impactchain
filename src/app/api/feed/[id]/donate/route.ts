import { NextRequest, NextResponse } from 'next/server';
import { FeedService } from '@/lib/services/feedService';
import { DonateRequest } from '@/lib/types';

// POST /api/feed/[id]/donate
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
    const body: DonateRequest = await request.json();
    const { amount } = body;

    // Validate input
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Valid donation amount is required' },
        { status: 400 }
      );
    }

    // For mock implementation, use a default user ID
    const userId = 'user_001';

    // Donate to post
    const result = await FeedService.donateToPost(id, { amount }, userId);

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Donate to post error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to donate to post' 
      },
      { status: 500 }
    );
  }
} 