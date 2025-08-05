import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database/client';

export async function GET() {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;

    // Get some sample data
    const [userCount, communityCount, missionCount, rewardCount] = await Promise.all([
      prisma.user.count(),
      prisma.community.count(),
      prisma.mission.count(),
      prisma.reward.count(),
    ]);

    // Get a sample user with their data
    const sampleUser = await prisma.user.findFirst({
      include: {
        communities: {
          include: {
            community: true,
          },
        },
        missions: {
          include: {
            mission: true,
          },
        },
      },
    });

    // Get user analytics separately
    const userAnalytics = sampleUser ? await prisma.userAnalytics.findUnique({
      where: { userId: sampleUser.id },
    }) : null;

    return NextResponse.json({
      success: true,
      message: 'Database connection successful!',
      stats: {
        users: userCount,
        communities: communityCount,
        missions: missionCount,
        rewards: rewardCount,
      },
      sampleUser: sampleUser ? {
        id: sampleUser.id,
        name: sampleUser.name,
        email: sampleUser.email,
        smiles: sampleUser.smiles,
        level: sampleUser.level,
        score: sampleUser.score,
        badges: sampleUser.badges,
        communities: sampleUser.communities.length,
        missions: sampleUser.missions.length,
        analytics: userAnalytics,
      } : null,
    });
  } catch (error) {
    console.error('Database test failed:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
} 