import { NextRequest, NextResponse } from 'next/server';
import { CommunityService } from '@/lib/services/communityService';
import { AuthMiddleware } from '@/lib/middleware/auth';
import { CreateCommunityRequest } from '@/lib/types';

// GET /api/communities
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'all';
    const status = searchParams.get('status') || 'all';
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');

    const communities = await CommunityService.getCommunities({
      category,
      status,
      page,
      pageSize
    });

    return NextResponse.json({
      success: true,
      data: communities
    });

  } catch (error) {
    console.error('Get communities error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get communities' 
      },
      { status: 500 }
    );
  }
}

// POST /api/communities
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

    const body: CreateCommunityRequest = await request.json();
    const { name, description, category, logo, banner, location, website } = body;

    // Validate input
    if (!name || !description || !category) {
      return NextResponse.json(
        { success: false, error: 'Name, description, and category are required' },
        { status: 400 }
      );
    }

    // Create community with authenticated user
    const community = await CommunityService.createCommunityWithUser(body, userId);

    return NextResponse.json({
      success: true,
      data: {
        community: {
          id: community.id,
          name: community.name,
          status: community.status
        }
      }
    });

  } catch (error) {
    console.error('Create community error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create community' 
      },
      { status: 500 }
    );
  }
} 