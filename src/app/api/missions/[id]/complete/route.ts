import { NextRequest, NextResponse } from 'next/server';
import { MissionService } from '@/lib/services/missionService';
import { CompleteMissionRequest } from '@/lib/types';

// POST /api/missions/[id]/complete
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const missionId = params.id;
    const body: CompleteMissionRequest = await request.json();

    // In real app, validate JWT token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Authorization token required' },
        { status: 401 }
      );
    }

    // For mock implementation, use a default user ID
    const userId = 'user_001';

    // Complete mission
    const result = await MissionService.completeMission(missionId, body, userId);

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