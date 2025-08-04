import { NextRequest, NextResponse } from 'next/server';
import { MissionService } from '@/lib/services/missionService';

// POST /api/missions/[id]/accept
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

    // For mock implementation, use a default user ID
    const userId = 'user_001';

    // Accept mission
    const mission = await MissionService.acceptMission(id, userId);

    return NextResponse.json({
      success: true,
      data: {
        mission: {
          id: mission.id,
          status: mission.status
        }
      }
    });

  } catch (error) {
    console.error('Accept mission error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to accept mission' 
      },
      { status: 500 }
    );
  }
} 