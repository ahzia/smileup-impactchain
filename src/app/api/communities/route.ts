import { NextRequest, NextResponse } from 'next/server';
import { CommunityService } from '@/lib/services/communityService';
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
    // In real app, validate JWT token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Authorization token required' },
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

    // For mock implementation, use a default user ID
    const userId = 'user_001';

    // Create community
    const community = await CommunityService.createCommunity(body, userId);

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