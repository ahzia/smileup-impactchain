import { NextRequest, NextResponse } from 'next/server';
import { AuthMiddleware } from '@/lib/middleware/auth';
import { CustodialWalletService } from '@/lib/wallet/custodialWalletService';
import { prisma } from '@/lib/database/client';

export async function GET(request: NextRequest) {
  try {
    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        level: true,
        score: true,
        bio: true,
        interests: true,
        badges: true,
        createdAt: true,
      },
      orderBy: {
        score: 'desc'
      },
      take: 50
    });

    // Get real-time balances for all users
    const custodialWalletService = new CustodialWalletService();
    const leaderboard = await Promise.all(
      users.map(async (user) => {
        const walletBalance = await custodialWalletService.getUserBalance(user.id);
        
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatarUrl || '',
          smiles: walletBalance.smiles, // Real-time balance from wallet
          level: user.level,
          score: user.score,
          bio: user.bio || '',
          interests: user.interests,
          badges: user.badges,
          createdAt: user.createdAt.toISOString()
        };
      })
    );

    // Sort by real-time smiles balance
    leaderboard.sort((a, b) => b.smiles - a.smiles);

    return NextResponse.json({
      success: true,
      data: leaderboard
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