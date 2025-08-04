import { NextRequest, NextResponse } from 'next/server';
import { CommunityService } from '@/lib/services/communityService';

// GET /api/communities/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const community = await CommunityService.getCommunityById(id);

    if (!community) {
      return NextResponse.json(
        { success: false, error: 'Community not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: community
    });

  } catch (error) {
    console.error('Get community error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get community' 
      },
      { status: 500 }
    );
  }
} 