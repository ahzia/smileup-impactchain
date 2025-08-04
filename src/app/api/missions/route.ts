import { NextRequest, NextResponse } from 'next/server';
import { MissionService } from '@/lib/services/missionService';
import { CreateMissionRequest } from '@/lib/types';

// GET /api/missions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';
    const status = searchParams.get('status') || 'all';
    const communityId = searchParams.get('communityId') || undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');

    const missions = await MissionService.getMissions({
      type,
      status,
      communityId,
      page,
      pageSize
    });

    return NextResponse.json({
      success: true,
      data: missions
    });

  } catch (error) {
    console.error('Get missions error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get missions' 
      },
      { status: 500 }
    );
  }
}

// POST /api/missions
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

    const body: CreateMissionRequest = await request.json();
    const { title, description, reward, proofRequired, deadline, effortLevel, requiredTime, icon, category, communityId } = body;

    // Validate input
    if (!title || !description || !reward || !effortLevel || !requiredTime || !icon || !category || !communityId) {
      return NextResponse.json(
        { success: false, error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    // Validate reward amount
    if (reward <= 0) {
      return NextResponse.json(
        { success: false, error: 'Reward must be greater than 0' },
        { status: 400 }
      );
    }

    // For mock implementation, use a default user ID
    const userId = 'user_001';

    // Create mission
    const mission = await MissionService.createMission(body, userId);

    return NextResponse.json({
      success: true,
      data: {
        mission: {
          id: mission.id,
          title: mission.title
        }
      }
    });

  } catch (error) {
    console.error('Create mission error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create mission' 
      },
      { status: 500 }
    );
  }
} 