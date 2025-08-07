import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/lib/services/userService';
import { AuthMiddleware } from '@/lib/middleware/auth';

// GET /api/user/profile
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

    // Get user profile with real-time balance
    const userProfile = await UserService.getUserProfile(userId);

    return NextResponse.json({
      success: true,
      data: userProfile
    });

  } catch (error) {
    console.error('Get user profile error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get user profile' 
      },
      { status: 500 }
    );
  }
}

// PUT /api/user/profile
export async function PUT(request: NextRequest) {
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

    const body: UpdateProfileRequest = await request.json();
    const { name, bio, interests, avatar } = body;

    // Validate input
    if (!name && !bio && !interests && !avatar) {
      return NextResponse.json(
        { success: false, error: 'At least one field must be provided' },
        { status: 400 }
      );
    }

    // Update profile
    const updatedUser = await AuthService.updateProfile(userId, {
      name,
      bio,
      interests,
      avatar
    });

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          bio: updatedUser.bio,
          interests: updatedUser.interests,
          avatar: updatedUser.avatar
        }
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update profile' 
      },
      { status: 500 }
    );
  }
} 