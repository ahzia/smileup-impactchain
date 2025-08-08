import { NextRequest, NextResponse } from 'next/server';
import { AuthMiddleware } from '@/lib/middleware/auth';
import { prisma } from '@/lib/database/client';

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

    console.log('🔄 Starting specific user updates...');

    const updatedUsers = [];

    // Update Demo User to Emma Watson with img3.jpg
    console.log('🔄 Updating Demo User to Emma Watson...');
    const demoUser = await prisma.user.update({
      where: { email: 'demo@smileup.com' },
      data: {
        name: 'Emma Watson',
        avatarUrl: '/profiles/img3.jpg'
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true
      }
    });
    updatedUsers.push(demoUser);
    console.log(`✅ Updated: ${demoUser.name} (${demoUser.email}) - ${demoUser.avatarUrl}`);

    // Update Auto Mint User to Zia with img1.jpg
    console.log('🔄 Updating Auto Mint User to Zia...');
    const ziaUser = await prisma.user.update({
      where: { email: 'automint@example.com' },
      data: {
        name: 'Zia',
        avatarUrl: '/profiles/img1.jpg'
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true
      }
    });
    updatedUsers.push(ziaUser);
    console.log(`✅ Updated: ${ziaUser.name} (${ziaUser.email}) - ${ziaUser.avatarUrl}`);

    // Update Auto Mint Test to Zamir with img2.jpg
    console.log('🔄 Updating Auto Mint Test to Zamir...');
    const zamirUser = await prisma.user.update({
      where: { email: 'automint2@example.com' },
      data: {
        name: 'Zamir',
        avatarUrl: '/profiles/img2.jpg'
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true
      }
    });
    updatedUsers.push(zamirUser);
    console.log(`✅ Updated: ${zamirUser.name} (${zamirUser.email}) - ${zamirUser.avatarUrl}`);

    console.log('\n🎉 Specific user updates completed!');

    return NextResponse.json({
      success: true,
      message: 'Successfully updated specific users with new names and profile pictures',
      data: {
        updatedUsers: updatedUsers.length,
        users: updatedUsers
      }
    });

  } catch (error) {
    console.error('❌ Error updating specific users:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update specific users' 
      },
      { status: 500 }
    );
  }
} 