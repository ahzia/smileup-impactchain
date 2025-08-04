import { NextRequest, NextResponse } from 'next/server';
import { FeedService } from '@/lib/services/feedService';
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
    // In real app, validate JWT token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Authorization token required' },
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

    // For mock implementation, use a default user ID
    const userId = 'user_001';

    // Create feed post
    const post = await FeedService.createFeedPost(body, userId);

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