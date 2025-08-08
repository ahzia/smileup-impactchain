import { NextRequest, NextResponse } from 'next/server';
import { FeedService } from '@/lib/services/feedService';
import { AuthMiddleware } from '@/lib/middleware/auth';
import { CreateFeedPostRequest } from '@/lib/types';

// GET /api/feed
export async function GET(request: NextRequest) {
  console.log('🚀 Feed API GET request received');
  console.log('📊 Request URL:', request.url);
  console.log('🔍 Search params:', request.nextUrl.searchParams.toString());
  
  try {
    console.log('🔧 Initializing FeedService...');
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '5');
    const category = searchParams.get('category') || undefined;
    const userId = searchParams.get('userId') || undefined;
    const communityId = searchParams.get('communityId') || undefined;

    console.log('📋 Feed API parameters:', {
      page,
      limit,
      category,
      userId,
      communityId
    });

    console.log('🔍 Calling FeedService.getFeedPosts...');
    const posts = await FeedService.getFeedPosts({
      page,
      pageSize: limit,
      category,
      communityId,
    });

    console.log('✅ Feed posts retrieved successfully, count:', posts.length);
    
    return NextResponse.json({
      success: true,
      data: posts,
    });
  } catch (error) {
    console.error('❌ Feed API error:', error);
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('❌ Error message:', error instanceof Error ? error.message : 'Unknown error');
    
    return NextResponse.json(
      {
        success: false,
        error: 'Get feed error: ' + (error instanceof Error ? error.message : 'Unknown error'),
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