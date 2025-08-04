import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/services/authService';
import { UpdateProfileRequest } from '@/lib/types';

// GET /api/user/profile
export async function GET(request: NextRequest) {
  try {
    // In real app, validate JWT token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Authorization token required' },
        { status: 401 }
      );
    }

    // For mock implementation, get current user
    const user = await AuthService.getCurrentUser();

    return NextResponse.json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get profile' 
      },
      { status: 500 }
    );
  }
}

// PUT /api/user/profile
export async function PUT(request: NextRequest) {
  try {
    // In real app, validate JWT token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Authorization token required' },
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
    const updatedUser = await AuthService.updateProfile({
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