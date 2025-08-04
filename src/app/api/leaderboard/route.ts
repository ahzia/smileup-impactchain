import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/services/authService';

// GET /api/leaderboard
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'all';
    const limit = parseInt(searchParams.get('limit') || '10');

    // Get all users and sort by Smiles
    const users = await AuthService.getAllUsers();
    
    // Sort by Smiles (descending)
    const sortedUsers = users
      .sort((a, b) => b.smiles - a.smiles)
      .slice(0, limit)
      .map(user => ({
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        smiles: user.smiles,
        level: user.level,
        score: user.score
      }));

    return NextResponse.json({
      success: true,
      data: sortedUsers
    });

  } catch (error) {
    console.error('Get leaderboard error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get leaderboard' 
      },
      { status: 500 }
    );
  }
} 