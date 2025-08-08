import { NextRequest, NextResponse } from 'next/server';
import { AuthMiddleware } from '@/lib/middleware/auth';
import { prisma } from '@/lib/database/client';

// Profile pictures available in public/profiles
const profilePictures = [
  '/profiles/img1.jpg',
  '/profiles/img2.jpeg',
  '/profiles/img3.jpg',
  '/profiles/img4.jpg',
  '/profiles/img5.jpeg'
];

export async function POST(request: NextRequest) {
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

    console.log('🖼️ Starting profile picture update...');

    // Get all users from the database
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true
      }
    });

    console.log(`📊 Found ${users.length} users to update`);

    if (users.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No users found in database',
        data: {
          updatedUsers: 0,
          users: []
        }
      });
    }

    const updatedUsers = [];

    // Update each user with a profile picture
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const profilePicture = profilePictures[i % profilePictures.length]; // Cycle through pictures
      
      console.log(`🔄 Updating ${user.name} (${user.email}) with ${profilePicture}`);
      
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          avatarUrl: profilePicture
        },
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true
        }
      });
      
      updatedUsers.push(updatedUser);
      console.log(`✅ Updated ${user.name} with profile picture`);
    }

    console.log('\n🎉 Profile picture update completed!');
    console.log(`📸 Updated ${users.length} users with real profile pictures`);

    return NextResponse.json({
      success: true,
      message: `Successfully updated ${users.length} users with real profile pictures`,
      data: {
        updatedUsers: users.length,
        users: updatedUsers
      }
    });

  } catch (error) {
    console.error('❌ Error updating profile pictures:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update profile pictures' 
      },
      { status: 500 }
    );
  }
} 