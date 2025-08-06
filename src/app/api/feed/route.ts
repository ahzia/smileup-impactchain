import { NextRequest, NextResponse } from 'next/server';
import { FeedService } from '@/lib/services/feedService';
import { AuthMiddleware } from '@/lib/middleware/auth';
import { CreateFeedPostRequest } from '@/lib/types';

// GET /api/feed
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const category = searchParams.get('category') || 'all';
    const communityId = searchParams.get('communityId') || undefined;

    const feedPosts = await FeedService.getFeedPosts({
      page,
      pageSize,
      category,
      communityId
    });

    return NextResponse.json({
      success: true,
      data: feedPosts
    });

  } catch (error) {
    console.error('Get feed error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get feed' 
      },
      { status: 500 }
    );
  }
}

// POST /api/feed
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

    const body: CreateFeedPostRequest = await request.json();
    const { title, description, mediaType, mediaUrl, challenge, callToAction, links, communityId } = body;

    // Validate input
    if (!title || !description || !mediaType || !mediaUrl || !communityId) {
      return NextResponse.json(
        { success: false, error: 'Title, description, media type, media URL, and community ID are required' },
        { status: 400 }
      );
    }

    // Create feed post with authenticated user
    const post = await FeedService.createFeedPostWithUser(body, userId);

    return NextResponse.json({
      success: true,
      data: {
        post: {
          id: post.id,
          title: post.title
        }
      }
    });

  } catch (error) {
    console.error('Create feed post error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create feed post' 
      },
      { status: 500 }
    );
  }
} 