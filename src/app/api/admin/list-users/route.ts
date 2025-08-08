import { NextRequest, NextResponse } from 'next/server';
import { AuthMiddleware } from '@/lib/middleware/auth';
import { prisma } from '@/lib/database/client';

export async function GET(request: NextRequest) {
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

    console.log('📋 Fetching all users...');

    // Get all users from the database
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        level: true,
        score: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    console.log(`📊 Found ${users.length} users`);

    return NextResponse.json({
      success: true,
      message: `Found ${users.length} users`,
      data: {
        totalUsers: users.length,
        users: users
      }
    });

  } catch (error) {
    console.error('❌ Error fetching users:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch users' 
      },
      { status: 500 }
    );
  }
} 