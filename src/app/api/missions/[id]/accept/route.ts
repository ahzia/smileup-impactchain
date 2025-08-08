import { NextRequest, NextResponse } from 'next/server';
import { MissionService } from '@/lib/services/missionService';
import { AuthMiddleware } from '@/lib/middleware/auth';

// POST /api/missions/[id]/accept
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id: missionId } = await params;

    // Accept mission with authenticated user
    const mission = await MissionService.joinMission(userId, missionId);

    return NextResponse.json({
      success: true,
      data: {
        mission: {
          id: mission.missionId,
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