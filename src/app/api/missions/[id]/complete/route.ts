import { NextRequest, NextResponse } from 'next/server';
import { MissionService } from '@/lib/services/missionService';
import { AuthMiddleware } from '@/lib/middleware/auth';
import { CompleteMissionRequest } from '@/lib/types';

// POST /api/missions/[id]/complete
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
    const body: CompleteMissionRequest = await request.json();

    // Complete mission with authenticated user
    const result = await MissionService.completeMission(
      userId, 
      missionId, 
      body.proofText,
      body.proofUrl ? [body.proofUrl] : undefined
    );

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Complete mission error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to complete mission' 
      },
      { status: 500 }
    );
  }
} 