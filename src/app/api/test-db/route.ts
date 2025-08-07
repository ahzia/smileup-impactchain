import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/database/client';
import { CustodialWalletService } from '@/lib/wallet/custodialWalletService';

export async function GET(request: NextRequest) {
  try {
    // Get a sample user
    const sampleUser = await prisma.user.findFirst({
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
      }
    });

    if (!sampleUser) {
      return NextResponse.json({
        success: false,
        error: 'No users found'
      });
    }

    // Get real-time balance from wallet
    const custodialWalletService = new CustodialWalletService();
    const walletBalance = await custodialWalletService.getUserBalance(sampleUser.id);

    return NextResponse.json({
      success: true,
      data: {
        id: sampleUser.id,
        name: sampleUser.name,
        email: sampleUser.email,
        avatar: sampleUser.avatarUrl || '',
        smiles: walletBalance.smiles, // Real-time balance from wallet
        level: sampleUser.level,
        score: sampleUser.score,
        bio: sampleUser.bio || '',
        interests: sampleUser.interests,
        badges: sampleUser.badges,
        createdAt: sampleUser.createdAt.toISOString()
      }
    });

  } catch (error) {
    console.error('Test DB error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Database test failed' 
      },
      { status: 500 }
    );
  }
} 